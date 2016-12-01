const {isLoggedIn, isAdmin} = require('../middleware/users');
const {
  newRelease,
  download,
  getAvailableVersions,
  checkForUpdates,
} = require('../middleware/application');


module.exports = function(router) {
  router.get('/application/versions', getAvailableVersions);
  router.get('/application/versions/check/:releaseDate', checkForUpdates);

  router.get('/application/download/:type?', download);

  router.post('/application/:releaseDate', isLoggedIn, isAdmin, newRelease);
};
