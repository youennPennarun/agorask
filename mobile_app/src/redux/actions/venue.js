/* @flow */
/* global fetch */
import Logger from '../../utils/Logger';
import Config from 'react-native-config';

const API_URL = Config.API_URL;

import {ToastAndroid} from 'react-native'

export const FETCHING_LIST = 'FETCHING_LIST_VENUES';
export const SUCCESS_LIST = 'SUCCESS_LIST_VENUES';
export const FAILURE_LIST = 'FAILURE_LISTE_VENUES';

export const UPDATE_SELECTED_VENUE = 'UPDATE_SELECTED_VENUE';
export const FETCHING_VENUE = 'FETCHING_VENUE';

export const PUSH = 'PUSH_VENUE';

const VENUE_API_URL = `${API_URL}/venues`;
// const API_URL = 'https://agorask.herokuapp.com/venues';

export function getVenuesWithTasksNearPosition(location: {latitude: number, longitude: number}, radius = 25) {
  return dispatch => {
    console.log(VENUE_API_URL);
    dispatch({
      type: FETCHING_LIST,
    });
    fetch(VENUE_API_URL, {
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
    .then((response): Promise<*> => {
      if (response.status === 200) {
        return response.json();
      } else {
        console.log('reject response')
        return Promise.reject(response);
      }
    })
    .then((venues: Array) => {
      dispatch({
        type: SUCCESS_LIST,
        venues,
      });
    })
    .catch(error => {
      if (error.message) {
        // TODO Better error handling
        ToastAndroid.show(error.message, ToastAndroid.SHORT);
      }
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
    fetch(`${VENUE_API_URL}/${param}`)
      .then(response => {
        Logger.log('response status' + response.status);
        return response.json();
      })
      .then(venue => dispatch({type: UPDATE_SELECTED_VENUE, venue}))
      .catch(e => console.error(e));
  };
}

export function pushVenue(venue) {
  return {
    type: PUSH,
    venue,
  };
}

