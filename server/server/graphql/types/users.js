const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLInt,
} = require('graphql');

const TaskListType = require('./taskList');
const {getFields, needMoreFields} = require('../../utils/getGraphQLSelection');

const TaskService = require('../../services/Task');

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    _id: {
      type: GraphQLString,
      description: 'user id',
    },
    userId: {
      type: GraphQLString,
      description: 'user id',
    },
    username: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'username',
    },
    tasks: {
      type: TaskListType,
      args: {
        offset: {
          type: GraphQLInt,
        },
        limit: {
          type: GraphQLInt,
        },
      },
      resolve: async (parent, params, source, fields) => {
        const fieldsNames = Object.keys(getFields(fields, Object)).map(field => field.replace(/^edges\./, ''));
        const {tasks: edges, total: count} = await TaskService.getTasksPostedByUser(parent._id, fieldsNames, params);
        return {
          edges,
          count,
        };
      },
    }, /*
    answeredTasks: {
      type: new GraphQLList(require('./tasks')),
      resolve: (parent, params, source, fields) => {
        const fieldsNames = getFields(fields, Object);
        if (needMoreFields(fieldsNames, parent.tasks)) {
          console.log(fieldsNames);
        }
        return parent.tasks;
      },
    },*/
  }),
});

module.exports = UserType;
