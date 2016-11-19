const userRoutes = require('./users');
const venueRoutes = require('./venues');
const taskRoutes = require('./tasks');

module.exports = function(router) {
  userRoutes(router);
  venueRoutes(router);
  taskRoutes(router);
};
