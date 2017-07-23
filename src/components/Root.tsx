import * as React from 'react';
import { Store } from 'redux';
import { Provider} from 'react-redux';

interface Props {
    component: React.Component<any, any>;
    store: Store<any>;
}

const wrapperStyle: React.CSSProperties = {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    minHeight: '100vh',
    paddingBottom: '45px'
};
export const Root = (props: Props) => {
    return (
        <Provider store={props.store}>
            <div style={wrapperStyle}>
                {props.component}
            </div>
        </Provider>
    );
};
