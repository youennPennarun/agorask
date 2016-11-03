import {FETCHING_LIST, SUCCESS_LIST, FAILURE_LIST} from '../actions/venue';

const venuesDefaultState = {
  isFetching: false,
  error: null,
  venues: [],
};
function venues(state = venuesDefaultState, action) {
  switch (action.type) {
    case FETCHING_LIST:
      return {
        ...state,
        isFetching: true,
        error: null,
      };
    case FAILURE_LIST:
      return {
        ...state,
        isFetching: false,
        error: action.error,
      };
    case SUCCESS_LIST:
      return {
        ...state,
        isFetching: false,
        error: null,
        venues: action.venues,
      };
    default:
      return state;
  }
}

export default {
  venues,
};