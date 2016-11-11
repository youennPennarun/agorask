const ICON_SIZE = 64;

const handleFailedRequest = function(response) {
  if (response.status === 404) {
    return null;
  }
  throw new Error(`Failed to call foursquare API (status: ${response.status})`);
};

const parseCategory = function(category) {
  return {
    name: category.shortName,
    icon: `${category.icon.prefix}${ICON_SIZE}${category.icon.suffix}`,
  };
};

const parseHours = function({timeframes = []}) {
  return [
    ...timeframes.map(timeframe => ({
      days: timeframe.days,
      time: (timeframe && timeframe.open) ? timeframe.open.map(t => t.renderedTime) : [],
    })),
  ];
};

const parseVenue = function(foursquareData) {
  const {id, name, contact, location, categories, url = '', hours = {timeframes: []}, bestPhoto = {}} = foursquareData;
  const venue = {
    source: 'foursquare',
    name,
    foursquareId: id,
    contact,
    address: {
      location: [location.lng, location.lat],
      formatted: location.formattedAddress,
    },
    categories: categories.map(parseCategory),
    website: url,
    hours: parseHours(hours),
    pictures: {
      prefix: bestPhoto.prefix,
      suffix: bestPhoto.suffix,
      width: bestPhoto.width,
      height: bestPhoto.height,
    },
  };
  return venue;
};

module.exports = {
  handleFailedRequest,
  parseVenue,
};
