/* @flow */
/* global fetch */
import {API_URL} from 'react-native-config';

export const FETCHING_TASK = 'FETCH_TASK';
export const SUCCESS_FETCH_TASK = 'SUCCESS_FETCH_TASK';

const TASKS_API_URL = `${API_URL}/tasks`;

export function getTask(id): Function {
  return dispatch => {
    dispatch({type: FETCHING_TASK, id});

    fetch(`${TASKS_API_URL}/${id}`)
      .then((response): Promise => {
        if (response.status === 200) {
          return response.json();
        }
        throw new Error(`Server responded with status ${response.status}`);
      })
      .then(task => { dispatch({type: SUCCESS_FETCH_TASK, task, id}); })
      .catch(e => { console.error(e); });
  };
}

