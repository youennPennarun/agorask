import {PUSH, POP} from '../actions/router';
import {NavigationExperimental} from 'react-native';

const {
 StateUtils: NavigationStateUtils,
} = NavigationExperimental;

type RouteType = {
  key: String,
};

type RouterStateType = {
  index: Number,
  key: String,
  animated: Boolean,
  routes: Array<RouteType>
};

const initialState: RouterStateType = {
  index: 0,
  key: 'App',
  animated: false,
  routes: [
    {
      key: 'map',
    },
  ],
};

function navigator (currentState: RouterStateType = initialState, action) {
  switch (action.type) {
    case PUSH:
      return NavigationStateUtils.push(currentState, action.route);
    case POP:
      return currentState.index > 0 ?
        NavigationStateUtils.pop(currentState) :
        currentState;
    default:
      return currentState;
  }
}

export default {
  navigator,
};
