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

const addTask = function* (title, venueId, {_id: userId, username}, date) {
  if (!title) throw new Error('invalid title');
  if (!venueId) throw new Error('invalid venueId');
  if (!userId) throw new Error('invalid user._id');
  if (!username) throw new Error('invalid user.username');

  if (!date) {
    date = new Date();
  }
  const taskData = new Task({
    title,
    venue: venueId,
    postedBy: {
      userId,
      username,
    },
    date,
  });
  const task = yield taskData.save();
  return task;
};

module.exports = {
  getTasks,
  getTask,
  getUserTasks,
  addTask,
}