const fullVenueFragment = `
  fragment fullVenue on Venue {
    _id
    name
    foursquareId
    website
    address {
      location
      formatted
    } 
    categories {
      name
      icon
    }
    tasks {
      _id
      title
      nbAnswers
    }
    contact {
      facebookName
      facebook
      twitter
      formattedPhone
      phone
    }
    picture(size: 35)
  }
`;

const getVenueById = `
  query q($id: ID!) {
    venue(id: $id)  {
      ...fullVenue
    }
  }
${fullVenueFragment}
`;

const getVenuesInRadius = `
  query q($lat: Float!, $lng: Float!, $radius: Float!) {
    venuesWithinRadius(lat: $lat, lng: $lng, radius: $radius)  {
      ...fullVenue
    }
  }
${fullVenueFragment}
`;

module.exports = {
  getVenueById,
  getVenuesInRadius,
};
