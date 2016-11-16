const fetch = require('node-fetch');
const {handleFailedRequest, parseVenue} = require('./utils');

const {FOURSQUARE_CLIENT_ID, FOURSQUARE_CLIENT_SECRET} = process.env;
const VENUES_ENDPOINT = 'https://api.foursquare.com/v2/venues';
const FOURSQUARE_CLIENT_STRING = `client_id=${FOURSQUARE_CLIENT_ID}&client_secret=${FOURSQUARE_CLIENT_SECRET}&v=20161111`;

const getVenueById = function* (venueId) {
  const response = yield fetch(`${VENUES_ENDPOINT}/${venueId}?${FOURSQUARE_CLIENT_STRING}`);
  if (response.status !== 200) {
    return handleFailedRequest(response);
  }
  const json = yield response.json();
  return parseVenue(json.response.venue);
};

const searchVenue = function* ({lat, lng}, query, radius = 1000) {
  let url = `${VENUES_ENDPOINT}/search?ll=${lat},${lng}`;
  if (query) url += `&query=${query}`;
  if (radius) url += `&radius=${radius}`;

  const response = yield fetch(`${url}&${FOURSQUARE_CLIENT_STRING}`);
  if (response.status !== 200) {
    return handleFailedRequest(response);
  }
  const json = yield response.json();
  console.log(json);
  return json.response.venues.map(venue => parseVenue(venue));
};

module.exports = {
  getVenueById,
  searchVenue,
};
