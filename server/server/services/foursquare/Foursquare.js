const fetch = require('node-fetch');
const {handleFailedRequest, parseVenue} = require('./utils');

const {FOURSQUARE_CLIENT_ID, FOURSQUARE_CLIENT_SECRET} = process.env;
const VENUES_ENDPOINT = 'https://api.foursquare.com/v2/venues';
const FOURSQUARE_CLIENT_STRING = `client_id=${FOURSQUARE_CLIENT_ID}&client_secret=${FOURSQUARE_CLIENT_SECRET}&v=20161111`;

const getVenueById = async function (venueId) {
  const response = await fetch(`${VENUES_ENDPOINT}/${venueId}?${FOURSQUARE_CLIENT_STRING}`);
  if (response.status !== 200) {
    return handleFailedRequest(response);
  }
  const json = await response.json();
  return parseVenue(json.response.venue);
};

const searchVenue = async function ({lat, lng}, query, radius = 1000) {
  let url = `${VENUES_ENDPOINT}/search?ll=${lat},${lng}`;
  if (query) url += `&query=${query}`;
  if (radius) url += `&radius=${radius}`;
  console.log(`${url}&${FOURSQUARE_CLIENT_STRING}`);
  const response = await fetch(`${url}&${FOURSQUARE_CLIENT_STRING}`);
  if (response.status !== 200) {
    return handleFailedRequest(response);
  }
  const json = await response.json();
  console.log('[[[[[[[[[[[[[[[[[[[[[[[[[[[[')
  console.log(JSON.stringify(json.response.venues.map(venue => parseVenue(venue), null, 2)));
  return json.response.venues.map(venue => parseVenue(venue));
};

module.exports = {
  getVenueById,
  searchVenue,
};
