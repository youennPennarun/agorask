import {LOGIN, LOGIN_SUCCESS, LOGIN_FAIL, DISCONNECT, UPDATE_LOCATION} from '../actions/user';

type UserLocationType = {
  coords: {
    lat: Number,
    lng: Number,
  }
}

const defaultLocationState = {
  coords: null,
  error: null,
};

const defaultUserState = {
  isFetching: false,
  hasFailed: false,
  message: null,
  token: null,
  username: null,
};

function userLocation(state = defaultLocationState, action): UserLocationType {
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
        username: action.username,
      };
    case LOGIN_FAIL:
      return {
        ...state,
        isFetching: false,
        hasFailed: true,
        message: action.message,
      };
    case DISCONNECT:
      return {
        ...state,
        token: null,
        username: null,
      };
    default:
      return state;
 }
}

export default {
  userLocation,
  user,
};
