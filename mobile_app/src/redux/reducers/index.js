import { combineReducers } from 'redux';

import router from './router';
import user from './user';
import venue from './venue';
import search from './search';

const rootReducer = combineReducers({
  ...router,
  ...user,
  ...venue,
  ...search,
});

export default rootReducer;
