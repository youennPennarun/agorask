const Venue = require('../services/Venue');

async function getPicture (ctx) {
  const {id} = ctx.params;
  const venueUrl = await Venue.getVenuePictureUrlFromVenueId(id);
  if (!venueUrl) return ctx.throw('Unable to find the requested image', 404);
  ctx.response.redirect(venueUrl);
}

async function searchVenue(ctx) {
  const {lat, lng, query, radius} = ctx.request.query;
  if (!lat || !lng || !query) {
    console.log({lat, lng, query, radius}, this.request.query);
    return this.throw('BadRequest', 400);
  }
  const venues = await Venue.searchVenue({lat, lng}, query, radius);
  ctx.body = venues.map(Venue.reduce);
}


module.exports = {
  searchVenue,
  getPicture,
};
