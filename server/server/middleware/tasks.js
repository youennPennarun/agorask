const Task = require('../services/Task');


const getTask = function* () {
  const task = yield Task.getTask(this.params.id);
  if (!task) {
    return this.throw(`No tasks with id ${this.params.id}`, 404);
  }
  this.body = task;
};

const addTask = function* () {
  const {title, venueId} = this.request.body;
  const tokenPayload = this.request.tokenPayload;
  const user = {
    _id: tokenPayload.id,
    username: tokenPayload.username,
  };
  if (!title) return this.throw('Bad Request', 400, {errorData: {message: 'Invalid title'}});
  if (!venueId) return this.throw('Bad Request', 400, {errorData: {message: 'Invalid venue id'}});

  const task = yield Task.addTask(title, venueId, user, new Date());
  this.body = task;
};

module.exports = {
  getTask,
  addTask,
};
