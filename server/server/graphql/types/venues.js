const {
  GraphQLList,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLNonNull,
} = require('graphql');

const co = require('co');
const {getFields, needMoreFields} = require('../../utils/getGraphQLSelection');

const TaskType = require('./tasks');

const TaskService = require('../../services/Task');
const VenueService = require('../../services/Venue');

const ContactType = new GraphQLObjectType({
  name: 'contact',
  fields: () => ({
    facebookName: {
      type: GraphQLString,
    },
    facebook: {
      type: GraphQLString,
    },
    twitter: {
      type: GraphQLString,
    },
    formattedPhone: {
      type: GraphQLString,
    },
    phone: {
      type: GraphQLString,
    },
  }),
});

const AddressType = new GraphQLObjectType({
  name: 'address',
  fields: () => ({
    location: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLFloat)),
    },
    formatted: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLString)),
    },
  }),
});

const CategoryType = new GraphQLObjectType({
  name: 'category',
  fields: () => ({
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    icon: {
      type: GraphQLString,
    },
  }),
});

const VenueType = new GraphQLObjectType({
  name: 'Venue',
  fields: () => ({
    _id: {
      type: GraphQLString,
      description: 'venue\'s id',
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'venue\'s name',
    },
    source: {
      type: GraphQLString,
    },
    foursquareId: {
      type: GraphQLString,
      description: 'venues id from foursquare api',
    },
    contact: {
      type: ContactType,
      defaultValue: {
        formattedPhone: '',
      },
    },
    address: {
      type: AddressType,
    },
    website: {
      type: GraphQLString,
    },
    categories: {
      type: new GraphQLList(CategoryType),
    },
    tasks: {
      type: new GraphQLList(TaskType),
      resolve: (parent, params, source, fields) => {
        const fieldsNames = getFields(fields, Object);
        if (needMoreFields(fieldsNames, parent.tasks)) {
          const ids = parent.tasks.map(task => task._id);
          return co(TaskService.getTasksByIds(ids, fieldsNames));
        }
        return parent.tasks;
      },
    },
    nbTasks: {
      type: GraphQLInt,
    },
    nbOpenTasks: {
      type: GraphQLInt,
      resolve: (parent) => {
        return co(VenueService.getNbOpenTask(parent));
      },
    },
    picture: {
      type: GraphQLString,
      args: {
        size: {
          type: GraphQLFloat,
        },
      },
      resolve: (parent, {size}) => {
        return co(VenueService.getVenuePictureUrlFromVenueId(parent, size));
      },
    },
  }),
});

module.exports = VenueType;
