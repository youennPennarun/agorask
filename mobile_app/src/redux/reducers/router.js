import {PUSH, POP} from '../actions/router';

const defaultState = {
  currentRoute: {
    name: 'map',
    props: {},
  },
  history: [],
};

function router(state = defaultState, action) {
 switch (action.type) {
    case PUSH:
      return {
        history: [
          ...state.history,
          state.currentRoute,
        ],
        currentRoute: action.nextRoute,
      };
    case POP:
      const nextRoute = state.history.pop();
      return {
        history: [
          ...state.history,
        ],
        currentRoute: nextRoute,
      };
    default:
      return state;
 }
}

export default {
  router,
};
