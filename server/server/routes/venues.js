const koaBody = require('koa-body')();
const {getVenuesWithTasks} = require('../middleware/venues');


module.exports = function(router) {
  router.post('/venues/', koaBody, getVenuesWithTasks);
};
