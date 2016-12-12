const {Venue} = require('../utils/mongo/models');
const Foursquare = require('./foursquare/Foursquare');

const storeVenue = function* (venueData) {
  const venue = new Venue(venueData);
  yield venue.save();
  return venue;
};

const getVenueFromExternalSource = function* (id, source, fields) {
  let venue;
  let query;
  if (source === 'foursquare') {
    query = Venue.findOne({foursquareId: id});
    if (fields) query.select(fields);
    venue = yield query.exec();
    if (!venue) {
      const venueData = yield Foursquare.getVenueById(id);
      venue = yield storeVenue(venueData);
    }
  } else {
    throw new Error(`Unknow source ${source}`);
  }
  return venue;
};

const getVenue = function* (id, source, fields) {
  let venue;
  let query;
  if (!source) {
    query = Venue.findOne({_id: id});
    if (fields) query.select(fields);
    venue = yield query.exec();
  } else {
    venue = yield getVenueFromExternalSource(id, source, fields)
  }
  return venue;
};

const getVenuesWithinRadiusWithTasks = function* (center, radius, fields) {
  const radiusInRad = radius / 6378.1;
  if (!Array.isArray(center)) {
    if ((center.lat && center.lng) || (center.latitude && center.longitude)) {
      center = [center.lng, center.lat];
    } else {
      throw new Error(`Invalid parameters center. it should be an array [lng, lat] or an object {lat, lng} but got ${JSON.stringify(center)}`);
    }
  }
  const query = Venue.find({
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
  });
  if (fields) {
    query.select(fields);
  }
  const venues = yield query.exec();
  return venues;
};

const searchVenue = function* ({lat, lng}, query, radius) {
  const venues = yield Foursquare.searchVenue({lat, lng}, query, radius);
  return venues;
};

const getVenuePicture = function(venue, size) {
  const defaultImg = 'http://www.eltis.org/sites/eltis/files/default_images/photo_default_4.png';
  console.log(venue)
  if (!venue) return defaultImg;
  if (!venue.pictures) return defaultImg;
  if (venue.pictures.url) return venue.pictures.url;
  if (!venue.pictures.prefix || !venue.pictures.suffix) return defaultImg;
  const sizeParam = (size) ? `${size.width}x${size.height}` : 'original';
  return `${venue.pictures.prefix}${sizeParam}${venue.pictures.suffix}`;
};

const getVenuePictureUrlFromVenueId = function* (venueId, size) {
  const venue = yield getVenue(venueId);
  return getVenuePicture(venue, size);
};

const reduce = function(venue) {
  return {
    _id: venue._id,
    source: venue.source,
    name: venue.name,
    foursquareId: venue.id,
    address: {
      location: venue.address.location,
    },
    nbTasks: (venue.tasks) ? venue.tasks.length : 0,
  };
};

module.exports = {
  getVenue,
  getVenuesWithinRadiusWithTasks,
  searchVenue,
  getVenuePicture,
  getVenuePictureUrlFromVenueId,
  reduce,
};
