import router from './router';
import user from './user';
import venue from './venue';
import search from './search';

const reducers = {
  ...router,
  ...user,
  ...venue,
  ...search,
};

export default reducers;
