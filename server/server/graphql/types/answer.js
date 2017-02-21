const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
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
    _id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'task\'s id',
    },
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
    rating: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Answer rating value',
    },
    userRating: {
      type: AnswerRatingUserType,
      args: {
        token: {
          name: 'token',
          type: GraphQLString,
        },
      },
      resolve: (parent, {token}) => {
        if (!token) return null;
        const payload = Auth.isTokenValid(token);
        if (payload === false) {
          return null;
        }
        return co(Task.getUserRating(parent._id, payload.id));
      },
    },
  }),
});

module.exports = AnswerType;
