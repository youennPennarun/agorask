const Venue = require('../services/Venue');

const getVenue = function* () {
  const venue = yield Venue.getVenue(this.params.id, this.query.source);
  if (!venue) {
    return this.throw(`No venue with id ${this.params.id}`, 404);
  }
  this.body = venue;
};

const getVenuesWithTasks = function* () {
  const {lat, lng, radius} = this.request.body;
  if (!lat || !lng || !radius) return this.throw('BadRequest', 400);
  const venues = yield Venue.getVenuesWithinRadiusWithTasks([lng, lat], radius);
  this.body = venues.map(Venue.reduce);
};


const searchVenue = function* () {
  const {lat, lng, query, radius} = this.request.query;
  if (!lat || !lng || !query) {
    console.log({lat, lng, query, radius}, this.request.query);
    return this.throw('BadRequest', 400);
  }
  const venues = yield Venue.searchVenue({lat, lng}, query, radius);
  this.body = venues.map(Venue.reduce);
};

const getPicture = function* () {
  const {id} = this.params;
  const venueUrl = yield Venue.getVenuePictureUrlFromVenueId(id);
  if (!venueUrl) return this.throw('Unable to find the requested image', 404);
  this.response.redirect(venueUrl);
};


module.exports = {
  getVenue,
  getVenuesWithTasks,
  getPicture,
  searchVenue,
};
