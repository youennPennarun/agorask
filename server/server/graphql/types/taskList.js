const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLInt,
} = require('graphql');

const TaskListType = new GraphQLObjectType({
  name: 'Tasks',
  fields: () => ({
    count: {
      type: GraphQLInt,
    },
    edges: {
      type: new GraphQLList(require('./tasks')),
    },
  }),
});

module.exports = TaskListType;
