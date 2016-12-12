const {
  GraphQLID,
  GraphQLNonNull,
} = require('graphql');

const TaskType = require('../../types/tasks');
const TaskService = require('../../../services/Task');

const co = require('co');


const task = {
  type: TaskType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve: function (root, {id}) {
    return co(TaskService.getTask(id));
  },
};

module.exports = {
  task,
};
