const {Task} = require('../utils/mongo/models');

const getTasks = function* (offset = 0, limit = 5) {
  const tasks = yield Task.find({})
          .skip(offset)
          .limit(limit)
          .exec();
  return tasks;
};

const getTask = function* (id) {
  const task = yield Task.findOne({_id: id})
          .exec();
  return task;
};

const getUserTasks = function* (username, offset = 0, limit = 10) {
  const tasks = yield Task.find({'postedBy.username': username})
          .skip(offset)
          .limit(limit)
          .exec();
  return tasks;
};

const addTask = function* () {

}


module.exports = {
  getTasks,
  getTask,
  getUserTasks,
  addTask,
}