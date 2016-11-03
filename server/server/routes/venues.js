const koaBody = require('koa-body')();
const {isLoggedIn} = require('../middleware/users');
const {getVenue, getVenuesWithinRadius} = require('../middleware/venues');


module.exports = function(router) {
  /**
   * @params {ObjectId} id: Id of the venue to return
   * @return {Venue}
   */
  router.get('/venues/:id', getVenue);

  router.post('/venues/', koaBody, getVenuesWithinRadius);
};
