const {
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLInputObjectType,
} = require('graphql');

const co = require('co');

const AnswerType = require('../../types/answer');
const TaskService = require('../../../services/Task');
const Auth = require('../../../services/Authentification');

const AnswerInputType = new GraphQLInputObjectType({
  name: 'AnswerInput',
  fields: () => ({
    answer: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'the answer',
    },
  }),
});

const answer = {
  type: AnswerType,
  name: 'Answer',
  description: 'Add an answer',
  args: {
    taskId: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'The id of the task that the answer should be added',
    },
    answer: {
      type: new GraphQLNonNull(AnswerInputType),
    },
    token: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Authentification token',
    },
  },
  resolve: function (root, {taskId, answer: answerData, token}, options, fields) {
    const payload = Auth.isTokenValid(token);
    if (payload === false) {
      throw new Error('Unauthorized');
    }
    answerData.postedBy = {
      userId: payload.id,
      username: payload.username,
    };
    return co(TaskService.addAnswer(taskId, answerData));
  },
};

module.exports = {
  answer,
};
