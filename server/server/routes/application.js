const {isLoggedIn, isAdmin} = require('../middleware/users');
const co = require('co');
const {
  newRelease,
  download,
  getAvailableVersions,
  checkForUpdates,
} = require('../middleware/application');


module.exports = function(router) {
  router.get('/application/versions', getAvailableVersions);
  router.get('/application/download/:type?', download);

  router.get('/application/check/:releaseDate', checkForUpdates);

  router.post('/application/:releaseDate', isLoggedIn, isAdmin, ctx => co(function* () { return yield newRelease(ctx)}));
};
