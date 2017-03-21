const {getPicture} = require('../middleware/venues');


module.exports = function(router) {
  router.get('/venues/:id/image', getPicture);
};
