/* global __DEV__, Reactotron */

import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

import { autoRehydrate } from 'redux-persist';

import reducers from './reducers';

const loggerMiddleware = createLogger();

const middlewares = [thunkMiddleware];

let _createStore = createStore;
if (__DEV__) {
  // middlewares.push(loggerMiddleware);
  _createStore = Reactotron.createStore;
}

const queue = {};
let clientQL = null;

const storage = store => next => action => {
  if (action.type === 'APOLLO_MUTATION_INIT') {
    if (!queue[action.mutationId]) {
      console.log('Storing mutation', action.mutationId);
      const save = {
        mutation: action.mutation,
        variables: action.variables,
        optimisticResponse: action.optimisticResponse,
        updateQueries: action.updateQueriesByName,
        refetchQueries: [],
      };
      queue[action.mutationId] = save;
    }
  } else if (action.type === 'APOLLO_MUTATION_RESULT') {
    if (queue[action.mutationId]) {
      delete queue[action.mutationId];
    }
  } else if (action.type === 'APOLLO_MUTATION_ERROR') {
    if (queue[action.mutationId]) {
      queue[action.mutationId].__retried = true;
      const mutation = { ...queue[action.mutationId] };
      delete queue[action.mutationId];
      setTimeout(
        () => {
          clientQL.mutate(mutation);
        },
        60000,
      );
    }
  }
  return next(action);
};
// middlewares.push(storage);

function configureStore(apolloClient) {
  clientQL = apolloClient;
  const reducersWithApollo = combineReducers({
    ...reducers,
    apollo: apolloClient.reducer(),
  });
  middlewares.push(apolloClient.middleware());
  const store = _createStore(
    reducersWithApollo,
    {},
    compose(applyMiddleware(...middlewares), autoRehydrate()),
  );

  if (module.hot) {
    module.hot.accept(() => {
      // eslint-disable-next-line global-require
      const nextReducers = require('./reducers').default;
      const nextRootReducer = combineReducers({
        ...nextReducers,
        apollo: apolloClient.reducer(),
      });
      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}

export default configureStore;
