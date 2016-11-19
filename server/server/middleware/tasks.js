const Task = require('../services/Task');


const getTask = function* () {
  const task = yield Task.getTask(this.params.id);
  if (!task) {
    return this.throw(`No tasks with id ${this.params.id}`, 404);
  }
  this.body = task;
};

module.exports = {
  getTask,
};
