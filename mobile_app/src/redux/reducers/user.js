import {LOGIN, LOGIN_SUCCESS, LOGIN_FAIL} from '../actions/user';

const defaultState = {
  isFetching: false,
  hasFailed: false,
  message: null,
  token: null,
};

function user(state = defaultState, action) {
 switch (action.type) {
    case LOGIN:
      return {
        ...state,
        hasFailed: false,
        isFetching: true,
        message: null,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isFetching: false,
        hasFailed: false,
        message: null,
        token: action.token,
      };
    case LOGIN_FAIL:
      return {
        ...state,
        isFetching: false,
        hasFailed: true,
        message: action.message,
      };
    default:
      return state;
 }
}

export default {
  user,
};
