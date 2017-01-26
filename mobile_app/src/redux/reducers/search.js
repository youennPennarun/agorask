import {UPDATE_QUERY, FETCHING_LIST, SUCCESS_LIST, FAILURE_LIST, CLEAR} from '../actions/search';

type SearchStateType = {
  version: Number,
  isFetching: Boolean,
  query: String,
  error: ?Object,
  venues: ?Array<Object>,
};

const searchDefaultState: SearchStateType = {
  version: 0,
  isFetching: false,
  query: '',
  error: null,
  venues: null,
};

function search(state: SearchStateType = searchDefaultState, action) {
  switch (action.type) {
    case UPDATE_QUERY:
      return {
        ...state,
        query: action.query,
      };
    case CLEAR:
      return {
        ...state,
        query: '',
        error: null,
        venues: null,
      };
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
        version: state.version + 1,
        venues: action.venues,
      };
    default:
      return state;
  }
}

export default {
  search,
};
