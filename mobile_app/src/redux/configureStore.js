/* global __DEV__, Reactotron */

import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

import reducers from './reducers';

const loggerMiddleware = createLogger();

const middlewares = [thunkMiddleware];

let _createStore = createStore;
if (__DEV__) {
 //  middlewares.push(loggerMiddleware);
  _createStore = Reactotron.createStore;
}

function configureStore(apolloClient) {
  const reducersWithApollo = combineReducers({
    ...reducers,
    apollo: apolloClient.reducer(),
  });
  middlewares.push(apolloClient.middleware());
  const store = _createStore(reducersWithApollo, {}, applyMiddleware(...middlewares));

  if (module.hot) {
    module.hot.accept(() => {
      // eslint-disable-next-line global-require
      const nextRootReducer = require('./reducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}

export default configureStore;
