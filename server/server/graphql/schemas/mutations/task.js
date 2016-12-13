const {
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLInputObjectType,
} = require('graphql');

const co = require('co');

const TaskType = require('../../types/tasks');
const TaskService = require('../../../services/Task');
const Auth = require('../../../services/Authentification');

const TaskInputType = new GraphQLInputObjectType({
  name: 'TaskInput',
  fields: () => ({
    title: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'the question',
    },
  }),
});

const task = {
  type: TaskType,
  name: 'Task',
  description: 'Add a task',
  args: {
    venueId: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'The id of the task that the answer should be added',
    },
    task: {
      type: new GraphQLNonNull(TaskInputType),
    },
    token: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Authentification token',
    },
  },
  resolve: function (root, {venueId, task: {title}, token}, options, fields) {
    const payload = Auth.isTokenValid(token);
    if (payload === false) {
      throw new Error('Unauthorized');
    }
    const user = {
      _id: payload.id,
      username: payload.username,
    };
    return co(TaskService.addTask(title, venueId, user, new Date()));
  },
};

module.exports = task;
