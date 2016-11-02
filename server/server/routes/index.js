const userRoutes = require('./users');
const venueRoutes = require('./venues');

module.exports = function(router) {
  userRoutes(router);
  venueRoutes(router);
};
