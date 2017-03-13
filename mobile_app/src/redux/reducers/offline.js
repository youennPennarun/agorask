
const defaultState = {};

export function getStorageKey(state, {action: {queryId}, variables}) {
  return state[queryId]
    .findIndex(stored => stored._storageId === JSON.stringify(variables));
}

function offline(state = defaultState, action) {
  switch (action.type) {
    case '_OFFLINE_SET_':
      const next = {...state};
      if (!next[action.action.queryId]) {
        next[action.action.queryId] = [];
      }
      const existing = getStorageKey(next, action);
      const save = {
        _storageId: action.storageKey,
        data: action.action,
      };
      if (existing === -1) {
        next[action.action.queryId].push(save);
      } else {
        next[action.action.queryId][existing] = save;
      }
      return next;
    default:
      return state;
  }
}

export default {
  offline,
};
