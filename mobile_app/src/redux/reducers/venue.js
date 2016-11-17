import {FETCHING_LIST, SUCCESS_LIST, FAILURE_LIST, FETCHING_VENUE, UPDATE_SELECTED_VENUE} from '../actions/venue';

const venuesDefaultState = {
  version: 0,
  isFetching: false,
  error: null,
  venues: [],
};

const selectedVenueDefaultState = {
  isFetching: false,
  _id: null,
  source: null,
  name: '',
  tasks: [],
};

function selectedVenue(state = selectedVenueDefaultState, action) {
  switch (action.type) {
    case FETCHING_VENUE:
      return {
      ...state,
      isFetching: true,
    };
    case UPDATE_SELECTED_VENUE:
      return {
        ...state,
        venue: action.venue,
        isFetching: false,
      };
  default:
    return state;
  }
}

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
        version: state.version + 1,
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
  selectedVenue,
};
