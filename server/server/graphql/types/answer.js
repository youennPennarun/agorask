const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
} = require('graphql');
const GraphQLDate = require('graphql-date');

const UserType = require('./users');

const AnswerType = new GraphQLObjectType({
  name: 'Answer',
  fields: () => ({
    answer: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'the answer',
    },
    postedBy: {
      type: new GraphQLNonNull(UserType),
      description: 'The user who posted the answer',
    },
    date: {
      type: new GraphQLNonNull(GraphQLDate),
      description: 'When the task was posted',
    },
  }),
});

module.exports = AnswerType;
