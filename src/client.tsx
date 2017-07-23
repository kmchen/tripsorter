import { render } from 'react-dom';
import * as React from 'react';
import { Root } from './components/Root';
import { getRoutes } from './routes';
import { configureStore } from './configureStore';
import * as Router from 'universal-router';

let initialState = (window as any).appState;
let store = configureStore(initialState);
let routes = getRoutes(store);
const router = new Router(routes);

function renderApp(location) {
    return router.resolve({path: location.pathname, store})
        .then(route => {
            const rootElement = document.querySelector('#react-app');
            const App = () => (
                <Root {...initialState.pageData} store={store} component={route.component} />
            );
            render(<App />, rootElement);
        })
}

export class Application {
    constructor() {
        renderApp(window.location);
    }
}

new Application();
