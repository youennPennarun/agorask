


export function getStored(state, {queryId, storageKey}) {
  if (!state[queryId]) return null;
  return state[queryId]
    .find(stored => stored._storageId === storageKey);
}
function queryResult(result, queryId, requestId) {
  return {
    ...result,
    type: 'APOLLO_QUERY_RESULT',
    queryId,
    requestId,
    fromStorage: true,
  };
}

const requests = {};
function requestKey(action) {
  return `${action.queryId}_${action.requestId}`;
}

function getSavedRequest(action) {
  return requests[requestKey(action)];
}
function setSavedRequest(action, storageKey) {
  requests[requestKey(action)] = storageKey;
}

function storeRequest(action) {
  const querySupport = action.document.offline;
  if (!getSavedRequest(action) && querySupport) {
    setSavedRequest(action, JSON.stringify(querySupport(action.variables)));
  }
  console.log(requests);
}
function onResult(store, action) {
  const querySupport = action.document.offline;
  const storageKey = getSavedRequest(action);
  if (querySupport && storageKey) {
    store.dispatch({
      action: action,
      storageKey,
      type: '_OFFLINE_SET_'});
    delete requests[requestKey(action)];
  }
}

function onError(store, action) {
  const storageKey = getSavedRequest(action);
  if (storageKey) {
    const stored = getStored(store.getState().offline, {storageKey, queryId: action.queryId});
    if (stored) {
      store.dispatch(queryResult(stored.data, action.queryId, action.requestId));
    }
  }
}

const offline = store => next => action => {
  if (action.type === 'APOLLO_QUERY_INIT') {
    storeRequest(action);
  } else if (action.type === 'APOLLO_QUERY_RESULT' && !action.fromStorage) {
    onResult(store, action);
  } else if (action.type === 'APOLLO_QUERY_ERROR') {
    onError(store, action);
  }
  return next(action);
};

export default offline;
