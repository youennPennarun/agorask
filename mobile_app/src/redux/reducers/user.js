import {LOGIN, LOGIN_SUCCESS, LOGIN_FAIL, UPDATE_LOCATION} from '../actions/user';

const defaultLocationState = {
  coords: null,
  error: null,
};

const defaultUserState = {
  isFetching: false,
  hasFailed: false,
  message: null,
  token: null,
};

function userLocation(state = defaultLocationState, action) {
 switch (action.type) {
    case UPDATE_LOCATION:
      return {
        ...state,
        coords: {
          lat: action.lat,
          lng: action.lng,
        },
      };
    default:
      return state;
 }
}

function user(state = defaultUserState, action) {
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
  userLocation,
  user,
};
