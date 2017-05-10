const koaBody = require('koa-body');
const {getPicture, searchVenue} = require('../middleware/venues');

module.exports = function(router) {
  router.get('/venues/:id/image', getPicture);
  router.get('/venues/search', searchVenue);
};
