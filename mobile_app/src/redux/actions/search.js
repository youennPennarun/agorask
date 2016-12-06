/* @flow */
/* global fetch */
import Config from 'react-native-config';

export const UPDATE_QUERY = 'UPDATE_QUERY_SEARCH_VENUES';
export const CLEAR = 'CLEAR_SEARCH_VENUES';
export const FETCHING_LIST = 'FETCHING_LIST_SEARCH_VENUES';
export const SUCCESS_LIST = 'SUCCESS_LIST_SEARCH_VENUES';
export const FAILURE_LIST = 'FAILURE_LISTE_SEARCH_VENUES';

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
    fetch(`${Config.API_URL}/venues/search${queryParams}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then((response): Promise<*> => {
      console.log(response);
      response.json();
    })
    .then((venues: Array) => {
      console.log("=========================");
      console.log(venues);
      console.log("=========================");
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
