import {FETCHING_LIST, SUCCESS_LIST, FAILURE_LIST, FETCHING_VENUE, UPDATE_SELECTED_VENUE} from '../actions/venue';
import {FETCHING_TASK, SUCCESS_FETCH_TASK} from '../actions/task';

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
  venue: {
    tasks: [],
  },
};

const defaultTaskState = {
  isFetching: false,
  error: null,
  _id: null,
  title: '',
  answers: [],
};

function task(state = defaultTaskState, action) {
  switch (action.type) {
    case FETCHING_TASK:
      if (action.id === state._id) {
        return {
          ...state,
          isFetching: true,
          error: null,
        };
      }
      return state;
    case SUCCESS_FETCH_TASK:
      if (action.id === state._id) {
        return {
          ...state,
          ...action.task,
          isFetching: false,
          error: null,
        };
      }
      return state;
    default:
      return state;
  }
}

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
    case FETCHING_TASK:
      return {
        ...state,
        venue: {
          ...state.venue,
          tasks: state.venue.tasks.map(taskState => task(taskState, action)),
        },
      };
    case SUCCESS_FETCH_TASK:
      return {
        ...state,
        venue: {
          ...state.venue,
          tasks: state.venue.tasks.map(taskState => task(taskState, action)),
        },
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
