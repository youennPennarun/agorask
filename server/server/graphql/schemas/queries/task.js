const {
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
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

module.exports = {
  task,
};
