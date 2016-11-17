/* @flow */
/* global fetch */

export const UPDATE_QUERY = 'UPDATE_QUERY_SEARCH_VENUES';
export const CLEAR = 'CLEAR_SEARCH_VENUES';
export const FETCHING_LIST = 'FETCHING_LIST_SEARCH_VENUES';
export const SUCCESS_LIST = 'SUCCESS_LIST_SEARCH_VENUES';
export const FAILURE_LIST = 'FAILURE_LISTE_SEARCH_VENUES';

const API_URL = 'http://192.168.0.10:3000/venues/search';
// const API_URL = 'https://agorask.herokuapp.com/venues';

export function updateQuery(query) {
  return {
    type: UPDATE_QUERY,
    query,
  };
}

export function clear() {
  return {
    type: CLEAR,
  };
}

export function searchVenue(radius = 3000) {
  return (dispatch, getState) => {
    const {query} = getState().search;
    const {coords} = getState().userLocation;

    const queryParams = `?lat=${coords.lat}&lng=${coords.lng}&query=${query}&radius=${radius}`;
    dispatch({
      type: FETCHING_LIST,
    });
    fetch(API_URL + queryParams, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
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
