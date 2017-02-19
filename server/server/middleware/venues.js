const Venue = require('../services/Venue');

const getPicture = function* () {
  const {id} = this.params;
  const venueUrl = yield Venue.getVenuePictureUrlFromVenueId(id);
  if (!venueUrl) return this.throw('Unable to find the requested image', 404);
  this.response.redirect(venueUrl);
};


module.exports = {
  getPicture,
};
