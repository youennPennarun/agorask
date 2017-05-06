const {
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
} = require('graphql');

const TaskType = require('../../types/tasks');
const TaskService = require('../../../services/Task');
const {getFields} = require('../../../utils/getGraphQLSelection');

const Auth = require('../../../services/Authentification');

const co = require('co');


const task = {
  type: TaskType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    token: {
      type: GraphQLString,
    },
  },
  resolve: function (root, {id, token}, source, fields) {
    const fieldsNames = getFields(fields, Object);
    let userId;
    if (token) {
     const payload = Auth.isTokenValid(token);
      if (payload !== false) {
        userId = payload.id;
      }
    }
    return co(TaskService.getTask(id, userId, fieldsNames));
  },
};

const userTasks = {
  type: new GraphQLList(TaskType),
  args: {
    token: {
      type: new GraphQLNonNull(GraphQLString),
    },
    offset: {
      type: GraphQLInt,
    },
    limit: {
      type: GraphQLInt,
    },
  },
  resolve: function (root, {token, offset, limit}, source, fields) {
    const fieldsNames = getFields(fields, Object);
    let username;
    if (token) {
     const payload = Auth.isTokenValid(token);
      if (payload !== false) {
        username = payload.username;
      }
    }
    return co(TaskService.getUserTasks(username, offset, limit, fieldsNames));
  },
};

module.exports = {
  task,
  userTasks,
};
