const userRoutes = require('./users');

module.exports = function(router) {
  userRoutes(router);
}