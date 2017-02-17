const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLInt,
} = require('graphql');
const GraphQLDate = require('graphql-date');
const co = require('co');

const Task = require('../../services/Task');
const Auth = require('../../services/Authentification');

const UserType = require('./users');

const AnswerRatingUserType = new GraphQLObjectType({
  name: 'AnswerRatingUser',
  fields: () => ({
    user: {
      type: new GraphQLNonNull(UserType),
    },
    rating: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  }),
});
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
    votes: {
      type: new GraphQLObjectType({
        name: 'AnswerRating',
        fields: () => ({
          rating: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'Answer rating value',
          },
          userRating: {
            type: AnswerRatingUserType,
          },
        }),
      }),
      args: {
        token: {
          name: 'token',
          type: GraphQLString,
        },
      },
      description: 'Answer ratings',
    },
  }),
});

module.exports = AnswerType;
