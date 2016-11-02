/* eslint-disable quote-props, comma-dangle */
const tasks = require('./taskData');
console.log('venue data');
module.exports = [
  {
  '_id': '581773476d568ac7723e1bae',
  'source': {
    'name': 'osm',
    'osmId': '86453022',
    'updated': '2016-01-06T14:47:19Z'
  },
  'name': 'The Apartment',
  'address': {
    'location': [-5.931764, 54.5969638],
    'houseNumber': '2',
    'postcode': 'BT1 6JA',
    'street': 'Donegall Square West'
  },
  'amenity': 'pub',
  tasks: [
    {
      _id: tasks[0]._id,
      title: tasks[0].title,
      nbAnswers: tasks[0].answers.length,
    },
    {
      _id: tasks[1]._id,
      title: tasks[1].title,
      nbAnswers: tasks[1].answers.length,
    }
  ],
}, {
  '_id': '5817738f6d568ac7723e1baf',
  'source': {
    'name': 'osm',
    'osmId': '86461420',
    'updated': '2007-11-29T23:46:04Z'
  },
  'name': 'Tesco Metro',
  'address': {
    'location': [-5.8783357, 54.6003581]
  },
  'shop': 'supermarket',
  tasks: [
    {
      _id: tasks[2]._id,
      title: tasks[2].title,
      nbAnswers: tasks[2].answers.length,
    }
  ],
}, {
  '_id': '5817739a6d568ac7723e1bb1',
  'source': {
    'name': 'osm',
    'osmId': '197618958',
    'updated': '2007-12-30T15:14:45Z'
  },
  'name': 'Tesco',
  'address': {
    'location': [-5.9071303, 54.5555226]
  },
  'shop': 'supermarket',
  tasks: [],
}, {
  '_id': '5817739f6d568ac7723e1bb2',
  'source': {
    'name': 'osm',
    'osmId': '364772574',
    'updated': '2016-07-28T20:42:34Z'
  },
  'name': 'The Botanic Inn',
  'address': {
    'location': [-5.9385555, 54.5809886]
  },
  'amenity': 'pub',
  tasks: [
    {
      _id: tasks[3]._id,
      title: tasks[3].title,
      nbAnswers: tasks[3].answers.length,
    },
    {
      _id: tasks[4]._id,
      title: tasks[4].title,
      nbAnswers: tasks[4].answers.length,
    }],
}, {
    '_id': '581773b06d568ac7723e1bb5',
  'source': {
    'name': 'osm',
    'osmId': '450146567',
    'updated': '2015-06-12T09:51:26Z'
  },
  'name': 'Ten Square',
  'address': {
    'location': [-5.9301928, 54.5958878]
  },
  'amenity': 'pub',
  tasks: [],
}, {
    '_id': '581773b86d568ac7723e1bb6',
  'source': {
    'name': 'osm',
    'osmId': '450146568',
    'updated': '2011-05-26T19:03:30Z'
  },
  'name': 'The Basement',
  'address': {
    'location': [-5.9283585, 54.5964173]
  },
  'amenity': 'pub',
  tasks: [],
}, {
    '_id': '581773be6d568ac7723e1bb7',
  'source': {
    'name': 'osm',
    'osmId': '450146569',
    'updated': '2014-05-21T15:04:09Z'
  },
  'name': 'Limelight 1',
  'address': {
    'location': [-5.9290437, 54.5929274]
  },
  'amenity': 'pub',
  tasks: [],
}, {
    '_id': '581773cc6d568ac7723e1bb8',
  'source': {
    'name': 'osm',
    'osmId': '450146571',
    'updated': '2014-05-21T15:04:32Z'
  },
  'name': 'Limelight 2',
  'address': {
    'location': [-5.9283928, 54.5927931]
  },
  'amenity': 'pub',
  tasks: [],
}, {
    '_id': '5817745c6d568ac7723e1bb9',
  'source': {
    'name': 'osm',
    'osmId': '469614989',
    'updated': '2014-02-02T16:02:11Z'
  },
  'name': 'Tesco',
  'address': {
    'location': [-5.8714987, 54.5958159]
  },
  'shop': 'supermarket',
  tasks: [
    {
      _id: tasks[5]._id,
      title: tasks[5].title,
      nbAnswers: tasks[5].answers.length,
    },
    {
      _id: tasks[6]._id,
      title: tasks[6].title,
      nbAnswers: tasks[6].answers.length,
    },],
}, {
    '_id': '581774636d568ac7723e1bba',
  'source': {
    'name': 'osm',
    'osmId': '469621096',
    'updated': '2014-08-06T03:19:11Z'
  },
  'name': 'the bar with no name',
  'address': {
    'location': [-5.9323268, 54.5915045],
    'street': 'Dublin Road',
    'houseNumber': '44'
  },
  'amenity': 'pub',
  tasks: [],
}];
