import * as React from 'react';
import * as ReactDOM from 'react-dom/server';

import { Html } from './components/Html';
import { Root } from './components/Root';
import { getRoutes } from './routes';

import { configureStore } from './configureStore';
import * as express from 'express';
import * as path from 'path';

import * as Router from 'universal-router';
import * as _ from 'lodash';

const renderHtml = (html: string) => ` <!DOCTYPE html> ${html} `;

import { resp } from './test';

const appStart = () => {
    const app = express();
    app.get('*', async (req, res, next) => {
        const store = configureStore({pageData: resp});
        const routes = getRoutes(store);
        const router = new Router(routes);
        router
            .resolve({path: req.path, response: res, store})
            .then((route) => {
                const ReactComp = (route.component as React.Component<any, any>);
                const content =  ReactDOM.renderToString(<Root store={store} component={ReactComp} />);
                const storeState = {...store.getState()};
                const html = ReactDOM.renderToStaticMarkup(<Html content={content} storeState={storeState} />);
                res.set('Content-Type', 'text/html');
                res.send(renderHtml(html));
                res.end();
            })
    });

    app.listen(1338, '0.0.0.0', (err) => {
        console.log('Listening at http://0.0.0.0:1338');
        if (err) {
            return console.log(`Server starting error: ${err}`);
        }
    });
};

appStart();
