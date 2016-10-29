const parseNode = (node) => {
  const parsedNode = {
    name: null,
    amenity: null,
    address: {
      location: {
        latitude: parseFloat(node.$.lat),
        longitude: parseFloat(node.$.lon),
      },
    },
  };
  node.$children.forEach(child => {
    if (typeof child === 'string' || !child.$) return;
    switch (child.$.k) {
      case 'website':
        parsedNode.website = child.$.v;
        break;
      case 'addr:housenumber':
        parsedNode.address.houseNumber = child.$.v;
        break;
        case 'addr:postcode':
        parsedNode.address.postcode = child.$.v;
        break;
      case 'addr:street':
        parsedNode.address.street = child.$.v;
        break;
      case 'addr:city':
        parsedNode.address.city = child.$.v;
        break;
      case 'amenity':
        parsedNode.amenity = child.$.v;
        break;
      case 'name':
        parsedNode.name = child.$.v;
        break;
      case 'cuisine':
        parsedNode.cuisine = child.$.v;
        break;
      case 'takeaway':
        parsedNode.takeaway = child.$.v;
        break;
      default:
        break;
    }
  })
  return parsedNode;
};

module.exports = parseNode;
