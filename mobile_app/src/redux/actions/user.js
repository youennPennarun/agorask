/* @flow */
import {AsyncStorage} from 'react-native';
import Config from 'react-native-config';
import {setDeviceToken} from '../../utils/Firebase';

export const CLEAN_ERRORS = 'USER_CLEAN_ERRORS';

export const LOGIN = 'USER_LOGIN';
export const LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';
export const LOGIN_FAIL = 'USER_LOGIN_FAIL';
export const DISCONNECT = 'USER_DISCONNECT';

export const LOGOUT = 'USER_LOGIN';

export const UPDATE_LOCATION = 'UPDATE_USER_LOCATION';

const config = {
  API_URL: Config.API_URL,
};

export function cleanErrors() {
  return {
    type: CLEAN_ERRORS,
  };
}

export function updateUserLocation(lat: Number, lng: Number): Object {
  return {
    type: UPDATE_LOCATION,
    lat,
    lng,
  };
}

function loginRequested(): {type: string} {
  return {
    type: LOGIN,
  };
}

function success(username: string, token: string): {type: string, token: string} {
  return {
    type: LOGIN_SUCCESS,
    token,
    username,
  };
}
function failed(message: string): {type: string, message: string} {
  return {
    type: LOGIN_FAIL,
    message,
  };
}

export function loadTokenFromStorage(): Function {
  return dispatch => {
    AsyncStorage.getItem('agorask:user')
      .then(userStr => {
        let username;
        let token;
        try {
          const parsed = JSON.parse(userStr);
          username = parsed.username;
          token = parsed.token;
          dispatch(success(username, token));
        } catch (e) {
          console.log(e);
        }
      })
      .catch(console.log);
  };
}

export function disconnect(token: string): Function {
  return dispatch => {
    AsyncStorage.removeItem('agorask:user')
      .then(() => {
        setDeviceToken(token, null);
        dispatch({
          type: DISCONNECT,
        });
      }).catch(console.log);
  };
}


export function login(username: string, password: string): Function {
  return (dispatch: Function): Promise<*> => {
    dispatch(loginRequested());
    return fetch(`${config.API_URL}/users/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
    .then((response: Object): Promise<Object> => {
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 401) {
        return Promise.reject(new Error('Invalid credentials'));
      }
      return Promise.reject(new Error(response.text));
    })
    .then(({token}) => {
      dispatch(success(username, token));
      return AsyncStorage.setItem('agorask:user', JSON.stringify({username, token}));
    })
    .then(() => {
    })
    .catch((e: Object) => {
      dispatch(failed(e.message));
    });
  };
}

export function doSignIn(username: string, email: string, password: string, image: Object): Function {
  return (dispatch: Function): Promise<*> => {
    dispatch(loginRequested());
    const body = new FormData();
    body.append('username', username);
    body.append('password', password);
    body.append('email', email);
    
    if (image && image.uri) {
      body.append('picture', {
        uri: image.uri,
        type: image.type,
        name: image.fileName,
      });
    }
    return fetch(`${config.API_URL}/users/register`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body,
    })
    .then((response: Object): Promise<*> => {
      if (response.status === 200) {
        return response.json();
      }
      return Promise.reject(response);
    })
    .then(({token}): Promise<*> => {
      console.log('OKKKKKKKK', token);
      dispatch(success(username, token));
      return AsyncStorage.setItem('agorask:user', JSON.stringify({username, token}));
    })
    .catch((e: Object) => {
      if (e.status === 409 || e.status === 400) {
        e.json()
          .then(json => dispatch(failed(json.error)))
          .catch(() => dispatch(failed(e.message)));
      } else {
        console.log(e);
        dispatch(failed(e.message));
      }
    });
  };
}
