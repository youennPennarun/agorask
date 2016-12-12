const {Task} = require('../utils/mongo/models');

const getTasks = function* (offset = 0, limit = 5) {
  const tasks = yield Task.find({})
          .skip(offset)
          .limit(limit)
          .sort({date: -1})
          .exec();
  return tasks;
};

const getTask = function* (id) {
  const task = yield Task.findOne({_id: id})
          .exec();
  return task;
};
const getTasksByIds = function* (ids, fields) {
  const query = Task.find({
    _id: { $in: ids},
  });
  if (fields) {
    query.select(fields);
  }
  const tasks = yield query.exec();
  return tasks;
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

const addAnswer = function* (taskId, answer, fields) {
  answer.date = new Date();
  const query = Task.findByIdAndUpdate(
    taskId,
    {$push: {answers: answer}},
    {new: true});
  if (fields) {
    query.select(fields);
  }
  const response = yield query.exec();
  if (response) {
    return answer;
  }
  return null;
}

module.exports = {
  getTasks,
  getTask,
  getUserTasks,
  addTask,
  getTasksByIds,
  addAnswer,
};
