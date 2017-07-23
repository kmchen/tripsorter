import { createStore, applyMiddleware, compose } from 'redux';
import  promiseMiddleware  from 'redux-promise-middleware';
import { reducers } from './reducers';
import thunk from 'redux-thunk';

export function configureStore(initialState) {
    let middlewares = [promiseMiddleware(), thunk];
    let composedStoreWMiddleware = applyMiddleware(...middlewares)(createStore);
    return compose(composedStoreWMiddleware)(reducers, initialState);
}
