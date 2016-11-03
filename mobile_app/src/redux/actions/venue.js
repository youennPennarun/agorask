/* @flow */
/* global fetch */

export const FETCHING_LIST = 'FETCHING_LIST_VENUES';
export const SUCCESS_LIST = 'SUCCESS_LIST_VENUES';
export const FAILURE_LIST = 'FAILUR_LISTE_VENUES';

const API_URL = 'http://192.168.0.10:3000/venues';

export function getVenuesWithTasksNearPosition(location: {latitude: number, longitude: number}, radius = 0.5) {
  console.log(location);
  return dispatch => {
    dispatch({
      type: FETCHING_LIST,
    });
    fetch(API_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lat: location.latitude,
        lng: location.longitude,
        radius,
        onlyWithTasks: true,
      }),
    })
    .then((response): Promise<*> => response.json())
    .then((venues: Array) => {
      dispatch({
        type: SUCCESS_LIST,
        venues,
      });
    })
    .catch(error => {
      dispatch({
        type: FAILURE_LIST,
        error,
      });
    });
  };
}
