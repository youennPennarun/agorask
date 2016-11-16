const {Venue} = require('../utils/mongo/models');
const Foursquare = require('./foursquare/Foursquare');

const storeVenue = function* (venueData) {
  const venue = new Venue(venueData);
  yield venue.save();
  return venue;
};

const getVenue = function* (id, source) {
  let venue;
  if (!source) {
    venue = yield Venue.findOne({_id: id}).exec();
  } else if (source === 'foursquare') {
    venue = yield Venue.findOne({foursquareId: id}).exec();
    if (!venue) {
      const venueData = yield Foursquare.getVenueById(id);
      venue = yield storeVenue(venueData);
    }
  } else {
    throw new Error(`Unknow source ${source}`);
  }
  return venue;
};

const getVenuesWithinRadiusWithTasks = function* (center, radius) {
  const radiusInRad = radius / 6378.1;
  if (!Array.isArray(center)) {
    if ((center.lat && center.lng) || (center.latitude && center.longitude)) {
      center = [center.lng, center.lat];
    } else {
      throw new Error(`Invalid parameters center. it should be an array [lng, lat] or an object {lat, lng} but got ${JSON.stringify(center)}`);
    }
  }
  const venues = yield Venue.find({
    $and: [
      {
        'address.location': {
          $geoWithin: {
            $centerSphere: [center, radiusInRad],
          },
        },
      },
      {
        tasks: {
          $not: {
            $size: 0,
          },
        },
      },
    ],
  })
  .exec();
  return venues;
};

const searchVenue = function* ({lat, lng}, query, radius) {
  const venues = yield Foursquare.searchVenue({lat, lng}, query, radius);
  return venues;
};

const getVenuePictureUrl = function* (venueId, size) {
  const venue = yield getVenue(venueId);
  const defaultImg = 'http://www.eltis.org/sites/eltis/files/default_images/photo_default_4.png';
  if (!venue) return defaultImg;
  if (!venue.pictures) return defaultImg;
  if (venue.pictures.url) return venue.pictures.url;
  if (!venue.pictures.prefix || !venue.pictures.suffix) return defaultImg;
  const sizeParam = (size) ? `${size.width}x${size.height}` : 'original';
  return `${venue.pictures.prefix}${sizeParam}${venue.pictures.suffix}`;
};

module.exports = {
  getVenue,
  getVenuesWithinRadiusWithTasks,
  searchVenue,
  getVenuePictureUrl,
};
