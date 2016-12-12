const {
  GraphQLID,
  GraphQLNonNull,
} = require('graphql');

const UserType = require('../../types/users');
const UserService = require('../../../services/User');

const co = require('co');


const user = {
  type: UserType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve: function (root, {id}) {
    return co(UserService.getUserById(id));
  },
};

module.exports = {
  user,
};
