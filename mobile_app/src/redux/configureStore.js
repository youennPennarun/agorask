/* global __DEV__ */

import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

import reducers from './reducers';

const loggerMiddleware = createLogger();

const middlewares = [thunkMiddleware];

if (__DEV__) {
  middlewares.push(loggerMiddleware);
}

const store = createStore(reducers, {}, applyMiddleware(...middlewares));

if (module.hot) {
  module.hot.accept(() => {
    // eslint-disable-next-line global-require
    const nextRootReducer = require('./reducers').default;
    store.replaceReducer(nextRootReducer);
  });
}

export default store;
