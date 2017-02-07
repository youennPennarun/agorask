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

const queue = {};
/*
const storage = store => next => action => {
  if (action.type === 'APOLLO_MUTATION_INIT') {
    if (!queue[action.mutationId]) {
      console.log('Storing mutation', action.mutationId)
      queue[action.mutationId] = action;
    }
  } else if (action.type === 'APOLLO_MUTATION_RESULT') {
    console.log('removing ', queue[action.mutationId])
    if (queue[action.mutationId]) {
      delete queue[action.mutationId];
    }
  } else if (action.type === 'APOLLO_MUTATION_ERROR') {
    console.log(action.mutationId, ' in? ', Object.keys(queue));
    if (queue[action.mutationId]) {
        queue[action.mutationId].__retried = true;
        console.log('will retry!!!!');
        setTimeout(() => {
          console.log('retry!!!');
          store.dispatch(queue[action.mutationId]);
        }, 1000)
    }
  }
  return next(action);
};
middlewares.push(storage);
*/


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
