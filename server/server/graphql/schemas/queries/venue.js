const {
  GraphQLList,
  GraphQLID,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLFloat,
  GraphQLString,
} = require('graphql');

const VenueType = require('../../types/venues');
const {getFields} = require('../../../utils/getGraphQLSelection');

const VenueService = require('../../../services/Venue');

const co = require('co');

const venuesWithinRadius = {
  type: new GraphQLList(VenueType),
  args: {
    lat: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    lng: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    radius: {
      name: 'radius',
      type: GraphQLFloat,
      description: 'Limit results to venues within this many meters.',
    },
  },
  resolve: function (root, {lat, lng, radius}, options, fields) {
    const fieldsNames = getFields(fields, Object);
    return co(VenueService.getVenuesWithinRadiusWithTasks({lat, lng}, radius, fieldsNames));
  },
};

const searchVenues = {
  type: new GraphQLList(VenueType),
  args: {
    lat: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    lng: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    radius: {
      name: 'radius',
      type: GraphQLFloat,
      description: 'Limit results to venues within this many meters.',
    },
    query: {
      type: new GraphQLNonNull(GraphQLString)
    },
  },
  resolve: function (root, {lat, lng, radius, query}, options) {
    return co(VenueService.searchVenue({lat, lng}, query, radius));
  },
};

const venue = {
  type: VenueType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    source: {
      type: GraphQLString,
    },
  },
  resolve: function (root, {id, source}, options, info) {
    const fieldsNames = getFields(info, Object);
    return co(VenueService.getVenue(id, source, fieldsNames));
  },
};

module.exports = {
  venue,
  searchVenues,
  venuesWithinRadius,
};
