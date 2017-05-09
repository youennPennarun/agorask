const Venue = require('../services/Venue');

async function getPicture (ctx) {
  const {id} = ctx.params;
  const venueUrl = await Venue.getVenuePictureUrlFromVenueId(id);
  if (!venueUrl) return ctx.throw('Unable to find the requested image', 404);
  ctx.response.redirect(venueUrl);
}


module.exports = {
  getPicture,
};
