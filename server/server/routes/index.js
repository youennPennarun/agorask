const userRoutes = require('./users');
const venueRoutes = require('./venues');
const taskRoutes = require('./tasks');
const applicationRoutes = require('./application');

module.exports = function(router) {
  router.get('/status', function() {
    this.body = {status: 'OK'};
  });
  userRoutes(router);
  venueRoutes(router);
  taskRoutes(router);
  applicationRoutes(router);
};
