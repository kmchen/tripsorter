import * as React from 'react';
import { connect } from 'react-redux';
import * as _ from 'lodash';

interface StateProps {
    testData: any;
}

interface IState {
    graph: any;
    submitHover: boolean;
    searchType: string;
    from: string;
    to: string;
    result: any;
}

type IProps = StateProps;

class IndexPage extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.setFrom = this.setFrom.bind(this);
        this.setTo = this.setTo.bind(this);
        this.continueSearchTime = this.continueSearchTime.bind(this);
        this.continueSearchPrice = this.continueSearchPrice.bind(this);
        this.state = {
            graph: {},
            submitHover: false,
            result: [],
            searchType: 'cheapest',
            from: '',
            to: ''
        };
    }

    componentDidMount() {
        const route = this.props.testData.deals;
        const graph = {};
        const addEdge = (node) => {
          if(graph[node.departure]) {
            graph[node.departure].push(node);
          } else {
            graph[node.departure] = [node];
          }
        }
        route.forEach((val, key) => {
            addEdge(val);
        })
        this.setState({graph: graph})
    }

    compute(newPath, fn) {
        let total = 0;
        _.forEach(newPath, (val, key) => {
            total +=fn(val)
        });
        return total;
    }

    computePrice(data){
        return this.compute(data, (val) => val.cost*(1-val.discount/100));
    };

    computeTime(data){
        return this.compute(data, (val) => parseInt(val.duration.h)*60+parseInt(val.duration.m));
    };

    update(newPath) {
        if(this.state.searchType == 'cheapest') {
            let total = this.computePrice(newPath);
            if(total < this.highest || this.highest == -1) {
              this.cheapest = newPath;
              this.highest = total;
            }
        } else {
            let total = this.computeTime(newPath);
            if(total < this.slowest || this.slowest == -1) {
              this.fastest = newPath;
              this.slowest = total;
            }
        }
    }

    continueSearchPrice(routes) {
       let sum = this.computePrice(routes);
       if(sum < this.highest || this.highest == -1) {
          return true;
       }
        return false;
    }

    continueSearchTime(routes) {
       let sum = this.computeTime(routes);
       if(sum < this.slowest || this.slowest == -1) {
         return true;
       }
       return false;
    }

    public cheapest = {};
    public highest = -1;
    public fastest = {};
    public slowest = -1;
    findRoutes(src, dest, continueFunc, visited ={}, path = []) {
      if(visited[src]){
        return;
      }
      _.forEach(this.state.graph[src], (val, key) => {
         let newPath = path.slice();
         newPath.push(val);
         if(dest == val.arrival) {
           this.update(newPath)
           return;
         } else {
           let newVisited = Object.assign({}, visited);
           newVisited[src] = true;
           if(continueFunc(newPath)) {
              this.findRoutes(val.arrival, dest, continueFunc, newVisited, newPath);
           }
         }
      })
    }

    setTo(event) {
      this.setState({to: event.target.value});
    }
    setFrom(event) {
      this.setState({from: event.target.value});
    }
    showRoutes() {
      let result = _.map(this.state.result, (val, key) => {
        return( 
          <div key={key} style={style.result}>
              <span> {val.departure} > {val.arrival}</span>
              <span style={{float: 'right'}}> {val.cost*(1-val.discount/100)}€</span>
              <br />
              <span> {val.transport} {val.reference} for {val.duration.h}h{val.duration.m}</span>
          </div>
        )
      }) 
      if(result.length > 0) {
        const totalTime = this.computeTime(this.state.result);
        const hour = Math.floor(totalTime/60);
        const min = totalTime%60==0? '':totalTime%60
        result.push(
            <div style={style.result} key={100}>
                <span>Total:</span>
                <span style={{marginLeft: 15}}>{hour}h{min}</span>
                <span style={{float: 'right'}}>{this.computePrice(this.state.result)}€</span>
            </div>
        );
      }
      return result;
    }
    render() {
        const search = () => {
            if(this.state.searchType == 'cheapest') {
                this.cheapest = {}
                this.highest = -1;
                this.findRoutes(this.state.from, this.state.to, this.continueSearchPrice)
                this.setState({result: this.cheapest});
            } else {
                this.fastest = {};
                this.slowest = -1;
                this.findRoutes(this.state.from, this.state.to, this.continueSearchTime)
                this.setState({result: this.fastest});
            }
        }
        const submitStyle = this.state.submitHover? {...style.submit, ...style.hover}:style.submit;
        return (
          <div style={style.background}>
            <div style={style.form}>
              <input style={style.input} onChange={this.setFrom} value={this.state.from} placeholder={`e.g. from ${this.state.from}`}/>
              <input style={style.input} onChange={this.setTo} value={this.state.to} placeholder={`e.g. to ${this.state.to}`}/>
              <label style={style.label}>
                  <input style={style.radio} type="radio" value="cheapest" checked={this.state.searchType == 'cheapest'}
                      onChange={() => {this.setState({searchType: 'cheapest'})}}/>
                    Cheapest
              </label>
              <label style={style.label}>
                  <input style={style.radio} type="radio" value="fastest" checked={this.state.searchType == 'fastest'}
                      onChange={() => {this.setState({searchType: 'fastest'})}}/>
                    Fastest
              </label>
              <button style={submitStyle}
                      onClick={() => {search()}}
                      onMouseLeave={() => this.setState({submitHover: false})}
                      onMouseOver={() => this.setState({submitHover: true})}
              >Search</button>
              <button style={submitStyle}
                      onClick={() => {this.setState({result:[], searchType: 'cheapest', from:'', to:''})}}
              >Reset</button>
            </div>
            <div style={{width: '20%'}}>
              { this.showRoutes() }
            </div>
          </div>
        );
    }
}

const style:React.CSSProperties = {
  result: {
    width: '100%',
    padding: '12px 20px',
    margin: '8px 0',
    display: 'inline-block',
    border: '1px solid #ccc',
    borderRadius: 4,
    boxSizing: 'border-box',
  },
  label: {
    marginRight: 15
  },
  radio: {
    marginRight: 5
  },
  form: {
    width: '20%',
    paddingRight: '30px',
  },
  input: {
    width: '100%',
    padding: '12px 20px',
    margin: '8px 0',
    display: 'inline-block',
    border: '1px solid #ccc',
    borderRadius: 4,
    boxSizing: 'border-box',
  },
  submit: {
    width: '100%',
    padding: '14px 20px',
    margin: '8px 0',
    border: 'none',
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    color: 'white',
    cursor: 'pointer'
  },
  hover: {
    backgroundColor: '#45a049'
  },
  background: {
    display: 'flex',
    borderRadius: 5,
    backgroundColor: '#f2f2f2',
    padding: 20
  }
}

export const Index = connect<StateProps, {}, any>((state) => {
        return {
            testData: state.pageData
        };
    },
    {})
(IndexPage);
