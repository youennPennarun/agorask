import {LOGIN, LOGIN_SUCCESS, LOGIN_FAIL, DISCONNECT, UPDATE_LOCATION, CLEAN_ERRORS} from '../actions/user';

type UserLocationType = {
  coords: {
    lat: Number,
    lng: Number,
  },
  error: ?Object,
}

type UserStateType = {
  isFetching: Boolean,
  hasFailed: Boolean,
  message: ?String,
  token: ?String,
  username: ?String,
};

const defaultLocationState: UserLocationType = {
  coords: null,
  error: null,
};

const defaultUserState: UserStateType = {
  isFetching: false,
  hasFailed: false,
  message: null,
  token: null,
  username: null,
};

function userLocation(state: UserLocationType = defaultLocationState, action): UserLocationType {
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

function user(state: UserStateType = defaultUserState, action): UserStateType {
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
    case CLEAN_ERRORS:
      return {
        ...state,
        isFetching: false,
        hasFailed: false,
        message: null,
      };
    default:
      return state;
 }
}

export default {
  userLocation,
  user,
};
