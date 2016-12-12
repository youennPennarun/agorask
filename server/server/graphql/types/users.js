const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
} = require('graphql');


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
  }),
});

module.exports = UserType;
