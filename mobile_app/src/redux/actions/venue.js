/* @flow */
/* global fetch */
import Logger from '../../utils/Logger';

export const FETCHING_LIST = 'FETCHING_LIST_VENUES';
export const SUCCESS_LIST = 'SUCCESS_LIST_VENUES';
export const FAILURE_LIST = 'FAILURE_LISTE_VENUES';

export const UPDATE_SELECTED_VENUE = 'UPDATE_SELECTED_VENUE';
export const FETCHING_VENUE = 'FETCHING_VENUE';

const API_URL = 'http://192.168.0.10:3000/venues';
// const API_URL = 'https://agorask.herokuapp.com/venues';

export function getVenuesWithTasksNearPosition(location: {latitude: number, longitude: number}, radius = 0.5) {
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

export function setSelectedVenue(venue) {
  return {
    type: UPDATE_SELECTED_VENUE,
    venue,
  };
}

export function getSelectedVenue(id, source) {
  return dispatch => {
    dispatch({type: FETCHING_VENUE});

    let param = id;
    if (source) {
      param += `?source=${source}`;
    }
    fetch(`${API_URL}/${param}`)
      .then(response => {
        Logger.log('response status' + response.status);
        return response.json();
      })
      .then(venue => dispatch({type: UPDATE_SELECTED_VENUE, venue}))
      .catch(e => console.error(e));
  };
}

