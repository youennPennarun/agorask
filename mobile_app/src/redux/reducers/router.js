import { PUSH, POP, TRANSITION_START, TRANSITION_END } from '../actions/router';
import { NavigationExperimental } from 'react-native';

const {
  StateUtils: NavigationStateUtils,
} = NavigationExperimental;

type RouteType = {
  key: String,
};

type RouterStateType = {
  index: Number,
  key: String,
  routeKey: String,
  animated: Boolean,
  routes: Array<RouteType>,
};

const initialState: RouterStateType = {
  index: 0,
  key: 'App',
  animated: false,
  routes: [
    {
      key: '0',
      routeKey: 'map',
    },
  ],
};

function isDuplicate(state, route): boolean {
  return state.routes.length && state.routes[state.routes.length - 1].key === route.key;
}

function navigator(currentState: RouterStateType = initialState, action) {
  switch (action.type) {
    case PUSH:
      return NavigationStateUtils.push(currentState, {
        ...action.route,
        key: '' + Date.now() + currentState.routes.length,
      });
    case POP:
      return currentState.index > 0 ? NavigationStateUtils.pop(currentState) : currentState;
    /*
    case TRANSITION_START:
      return {
        ...currentState,
        animated: true,
      };
    case TRANSITION_END:
      return {
        ...currentState,
        animated: false,
      };
      */
    default:
      return currentState;
  }
}

export default {
  navigator,
};
