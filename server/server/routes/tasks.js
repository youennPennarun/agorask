const {getTasksNearMe} = require('../middleware/tasks');


module.exports = function(router) {
  /**
   * @params {ObjectId} id: Id of the venue to return
   * @return {Venue}
   */
  router.get('/tasks', getTasksNearMe);
};
