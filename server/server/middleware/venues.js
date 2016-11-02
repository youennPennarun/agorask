const Venue = require('../services/Venue');

const getVenue = function* () {
  const venue = yield Venue.getVenue(this.params.id);
  if (!venue) {
    return this.throw(`No venue with id ${this.params.id}`, 404);
  }
  this.body = venue;
};

const getVenuesWithinRadius = function* () {
  const {lat, lng, radius} = this.request.body;
  if (!lat || !lng || !radius) return this.throw('BadRequest', 400);
  const venues = yield Venue.getVenuesWithinRadius([lng, lat], radius);
  this.body = venues;
};


module.exports = {
  getVenue,
  getVenuesWithinRadius,
};
