const {
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLEnumType,
  GraphQLObjectType,
} = require('graphql');

const co = require('co');

const TaskService = require('../../../services/Task');
const Auth = require('../../../services/Authentification');

const RatingInputEnum = new GraphQLEnumType({
  name: 'RatingInput',
  values: {
    POSITIVE: {
      value: '+1',
    },
    NEGATIVE: {
      value: '-1',
    },
  },
});

const RatingResult = new GraphQLObjectType({
  name: 'Rating',
  fields: () => ({
    rating: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  }),
});

const rate = {
  type: RatingResult,
  name: 'Rate',
  description: 'Rate an answer',
  args: {
    taskId: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'The id of the task corresponding to the answer',
    },
    answerId: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'The id of the answer',
    },
    ratingValue: {
      type: new GraphQLNonNull(RatingInputEnum),
      description: 'Rating value',
    },
    token: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Authentification token',
    },
  },
  resolve: function (root, {taskId, answerId, ratingValue, token}) {
    const payload = Auth.isTokenValid(token);
    if (payload === false) {
      throw new Error('Unauthorized');
    }
    const user = {
      _id: payload.id,
      username: payload.username,
    };
    return co(TaskService.vote(taskId, answerId, user, ratingValue))
      .then(rating => ({rating}));
  },
};

module.exports = rate;
