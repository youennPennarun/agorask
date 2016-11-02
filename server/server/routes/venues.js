const koaBody = require('koa-body')();
const {isLoggedIn} = require('../middleware/users');
const {getVenue, getVenuesWithinRadius} = require('../middleware/venues');

module.exports = function(router) {
  router.get('/venues/:id', isLoggedIn, getVenue);
  router.post('/venues/', isLoggedIn, koaBody, getVenuesWithinRadius);
};
