/* @flow */

export const LOGIN = 'USER_LOGIN';
export const LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';
export const LOGIN_FAIL = 'USER_LOGIN_FAIL';

export const LOGOUT = 'USER_LOGIN';

export const UPDATE_LOCATION = 'UPDATE_USER_LOCATION';

const config = {
  API_URL: 'http://localhost:3000',
};

export function updateUserLocation(lat, lng) {
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

function success(token: string): {type: string, token: string} {
  return {
    type: LOGIN_SUCCESS,
    token,
  };
}
function failed(message: string): {type: string, message: string} {
  return {
    type: LOGIN_FAIL,
    message,
  };
}


export function login(username: string, password: string): any {
  return (dispatch: Function): Promise<*> => {
    dispatch(loginRequested());
    return fetch(`${config.API_URL}/users/login`, {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
      }),
    })
    .then((response: Object): Object => response.json())
    .then(({token}) => {
      dispatch(success(token));
    })
    .catch(e => {
      dispatch(failed(e.message));
    });
  };
}
