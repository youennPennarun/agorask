const koaBody = require('koa-body')();
const {isLoggedIn} = require('../middleware/users');
const {getTask} = require('../middleware/tasks');


module.exports = function(router) {
  /**
   * @params {ObjectId} id: Id of the venue to return
   * @return {Venue}
   */
  router.get('/tasks/:id', getTask);
};
