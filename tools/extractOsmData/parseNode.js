const parseNode = (node) => {
  const parsedNode = {
    source: {
      name: 'osm',
      osmId: node.$.id,
      updated: node.$.timestamp,
    },
    name: null,
    address: {
      location: [parseFloat(node.$.lon), parseFloat(node.$.lat)],
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
      case 'shop':
        parsedNode.shop = child.$.v;
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
