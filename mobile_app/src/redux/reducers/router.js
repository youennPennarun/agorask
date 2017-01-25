import {PUSH, POP} from '../actions/router';
import {NavigationExperimental} from 'react-native';

const {
 StateUtils: NavigationStateUtils,
} = NavigationExperimental;

const initialState = {
  index: 0,
  key: 'App',
  animated: false,
  routes: [
    {
      key: 'map',
    },
  ],
};
function navigator (currentState = initialState, action) {
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
