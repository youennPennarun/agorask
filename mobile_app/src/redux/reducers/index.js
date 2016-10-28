import { combineReducers } from 'redux';

import router from './router';
import user from './user';

const rootReducer = combineReducers({
  ...router,
  ...user,
});

export default rootReducer;
