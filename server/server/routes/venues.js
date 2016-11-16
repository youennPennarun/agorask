const koaBody = require('koa-body')();
const {isLoggedIn} = require('../middleware/users');
const {getVenue, getVenuesWithTasks, getPicture, searchVenue} = require('../middleware/venues');


module.exports = function(router) {
  /**
   * @params {ObjectId} id: Id of the venue to return
   * @return {Venue}
   */
  router.get('/venues/:id', getVenue);
  router.get('/venues/:id/image', getPicture);

  router.post('/venues/', koaBody, getVenuesWithTasks);
  router.get('/venues/search', searchVenue);
};
