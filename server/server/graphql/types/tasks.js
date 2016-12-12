const {
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt,
} = require('graphql');
const GraphQLDate = require('graphql-date');

const co = require('co');

const {getFields} = require('../../utils/getGraphQLSelection');

const UserType = require('./users');
const AnswerType = require('./answer');

const VenueService = require('../../services/Venue');

const TaskType = new GraphQLObjectType({
  name: 'Task',
  fields: () => ({
    _id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'task\'s id',
    },
    title: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'task title id',
    },
    postedBy: {
      type: new GraphQLNonNull(UserType),
      description: 'The user who posted the task',
    },
    date: {
      type: GraphQLDate,
      description: 'When the task was posted',
    },
    answers: {
      type: new GraphQLList(AnswerType),
      description: 'The list of answers posted for this task',
    },
    venue: {
      type: require('./venues'),
      resolve: (parent, params, source, fields) => {
        const fieldsNames = getFields(fields, Object);
        return co(VenueService.getVenue(parent.venue, undefined, fieldsNames));
      },
    },
    nbAnswers: {
      type: GraphQLInt,
      description: 'The list of answers posted for this task',
      resolve: (parent) => {
        if (parent.answers) {
          return parent.answers.length;
        }
        return parent.nbAnswers || 0;
      },
    },
  }),
});

module.exports = TaskType;
