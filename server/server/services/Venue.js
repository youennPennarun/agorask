const {Venue} = require('../utils/mongo/models');

const getVenue = function* (id) {
  const venue = yield Venue.findOne({_id: id}).exec();
  return venue;
};

/**
 * center: array [lng, lat] or object {lat, lng}
 * radius: radius in kilometers
 */
const getVenuesWithinRadius = function* (center, radius) {
  const radiusInRad = radius / 6378.1;
  if (!Array.isArray(center)) {
    if ((center.lat && center.lng) || (center.latitude && center.longitude)) {
      center = [center.lng, center.lat];
    } else {
      throw new Error('Invalid parameters center. it should be an array [lng, lat] or an object {lat, lng} but got ' + JSON.stringify(center));
    }
  }
  const venues = yield Venue.find({
    'address.location': {
      $geoWithin: {
        $centerSphere: [center, radiusInRad],
      },
    },
  })
  .exec();
  return venues;
};
const getVenuesWithinRadiusWithTasks = function* (center, radius) {
  const radiusInRad = radius / 6378.1;
  if (!Array.isArray(center)) {
    if ((center.lat && center.lng) || (center.latitude && center.longitude)) {
      center = [center.lng, center.lat];
    } else {
      throw new Error('Invalid parameters center. it should be an array [lng, lat] or an object {lat, lng} but got ' + JSON.stringify(center));
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


module.exports = {
  getVenuesWithinRadius,
  getVenue,
  getVenuesWithinRadiusWithTasks,
};