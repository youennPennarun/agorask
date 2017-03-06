import router from './router';
import user from './user';
import venue from './venue';
import search from './search';

import settings from './settings';

const reducers = {
  ...router,
  ...user,
  ...venue,
  ...search,
  ...settings,
};

export default reducers;
