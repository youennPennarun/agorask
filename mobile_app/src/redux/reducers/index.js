import { combineReducers } from 'redux';

import router from './router';
import user from './user';
import venue from './venue';

const rootReducer = combineReducers({
  ...router,
  ...user,
  ...venue,
});

export default rootReducer;
