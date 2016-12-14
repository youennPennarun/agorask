/* eslint-disable quote-props, comma-dangle */
const tasks = require('./taskData');

function getTask(taskKey) {
  return {
    _id: tasks[taskKey]._id,
    title: tasks[taskKey].title,
    nbAnswers: tasks[taskKey].answers.length,
  };
}

module.exports = [{
  '_id': '581773476d568ac7723e1bae',
  'source': 'foursquare',
  'name': 'The Limelight',
  'foursquareId': '4b65d319f964a5203a022be3',
  'contact': {
    'phone': '02890325968',
    'formattedPhone': '028 9032 5968'
  },
  'address': {
    'location': [-5.928990840911865,
      54.592803881688155
    ],
    'formatted': [
      '17 Ormeau Ave',
      'Belfast',
      'BT2 8HD'
    ]
  },
  'categories': [{
    'name': 'Nightclub',
    'icon': 'https://ss3.4sqi.net/img/categories_v2/nightlife/nightclub_64.png'
  }],
  'website': 'http://www.limelightbelfast.com',
  'hours': [{
    'days': 'Mon',
    'time': [
      'Noon–1:00 AM'
    ]
  }, {
    'days': 'Tue–Sat',
    'time': [
      'Noon–2:00 AM'
    ]
  }, {
    'days': 'Sun',
    'time': [
      '3:00 PM–2:00 AM'
    ]
  }],
  'pictures': {
    'prefix': 'https://irs0.4sqi.net/img/general/',
    'suffix': '/RZx73X91WBg_n-Vr9OGx76qwTx_4m6fII-KsAxTB0dM.jpg',
    'width': 612,
    'height': 612
  },
  tasks: [
    getTask(0),
    getTask(1)
  ]
}, {
  '_id': '5817738f6d568ac7723e1baf',
  'source': 'foursquare',
  'name': 'Ormeau Baths Gallery',
  'foursquareId': '4beadc76a9900f47f9061740',
  'contact': {},
  'address': {
    'location': [-5.929163411658459,
      54.59263519737411
    ]
  },
  'categories': [{
    'name': 'Art Gallery',
    'icon': 'https://ss3.4sqi.net/img/categories_v2/arts_entertainment/artgallery_64.png'
  }],
  'website': '',
  'hours': [],
  'pictures': {
    'prefix': 'https://irs3.4sqi.net/img/general/',
    'suffix': '/47296435_a6m5HaWleEE72AfUh8uZL-h8JUFH7-CcUTU-z0P5CSU.jpg',
    'width': 612,
    'height': 612
  },
  tasks: [getTask(2)],
}, {
  '_id': '5817739a6d568ac7723e1bb1',
  'source': 'foursquare',
  'name': 'Katy\'s Bar',
  'foursquareId': '4b881043f964a520dfdc31e3',
  'contact': {
    'phone': '02890325968',
    'formattedPhone': '028 9032 5968'
  },
  'address': {
    'location': [-5.928924160916588,
      54.59276808539911
    ],
    'formatted': [
      '17 Ormeau Ave',
      'Belfast',
      'BT2 8HD'
    ]
  },
  'categories': [{
    'name': 'Pub',
    'icon': 'https://ss3.4sqi.net/img/categories_v2/nightlife/pub_64.png'
  }, {
    'name': 'Music Venue',
    'icon': 'https://ss3.4sqi.net/img/categories_v2/arts_entertainment/musicvenue_64.png'
  }],
  'website': '',
  'hours': [],
  'pictures': {
    'prefix': 'https://irs2.4sqi.net/img/general/',
    'suffix': '/52506820_LvHM3ZhBnTV9Dj-_M2asht54vhUa8yfRVySY_4oSByY.jpg',
    'width': 640,
    'height': 640
  },
  'tasks': [],
}, {
  '_id': '5817739f6d568ac7723e1bb2',
  'source': 'foursquare',
  'name': 'Belfast',
  'foursquareId': '4c1b57c155e4c9b6af1f4923',
  'contact': {},
  'address': {
    'location': [-5.929758781298715,
      54.596740681562636
    ],
    'formatted': [
      'Belfast'
    ]
  },
  'categories': [{
    'name': 'City',
    'icon': 'https://ss3.4sqi.net/img/categories_v2/parks_outdoors/neighborhood_64.png'
  }],
  'website': 'http://www.visit-belfast.com',
  'hours': [],
  'pictures': {
    'prefix': 'https://irs2.4sqi.net/img/general/',
    'suffix': '/20223769_baUq5b8yVh5NG35k1j9C6XjRQlwf0OyOQ_blzJfNrFs.jpg',
    'width': 720,
    'height': 720
  },
  'tasks': [
    getTask(3),
    getTask(4)
  ],
}, {
  '_id': '58261f716740058d9be7487f',
  'source': 'foursquare',
  'name': 'Club Vitae',
  'foursquareId': '4c49cbdbfbafc928356168db',
  'contact': {
    'phone': '+442890325454',
    'formattedPhone': '+44 28 9032 5454',
    'twitter': 'clubvitae_bel',
    'facebook': '1632655840309548',
    'facebookName': 'Club Vitae Belfast'
  },
  'address': {
    'location': [-5.9306833227175995, 54.59317433064174],
    'formatted': ['Clayton Hotel (22 Ormeau Avenue)', 'Antrim', 'BT2 8HS', 'United Kingdom']
  },
  'categories': [{
    'name': 'Gym / Fitness',
    'icon': 'https://ss3.4sqi.net/img/categories_v2/building/gym_64.png'
  }],
  'website': 'http://www.claytonhotelbelfast.com/leisure-centre/',
  'hours': [],
  'pictures': {
    'prefix': 'https://irs1.4sqi.net/img/general/',
    'suffix': '/36787200_1G1okicc8iHTleFJPhx4X6Uq_TUHHfME83XFougqIP4.jpg',
    'width': 720,
    'height': 960
  }
}, {
  '_id': '58261f8d6740058d9be74880',
  'source': 'foursquare',
  'name': 'Limelight 2',
  'foursquareId': '534042cc498ed9289907979b',
  'contact': {},
  'address': {
    'location': [-5.928351, 54.592757],
    'formatted': ['17 Ormeau ave', 'Belfast', 'United Kingdom']
  },
  'categories': [{
    'name': 'Nightclub',
    'icon': 'https://ss3.4sqi.net/img/categories_v2/nightlife/nightclub_64.png'
  }],
  'website': '',
  'hours': [],
  'pictures': {}
}, {
  '_id': '58261f9d6740058d9be74881',
  'source': 'foursquare',
  'name': 'Independent Republic of Atari',
  'foursquareId': '4d09e28ac370a35d1ea90d22',
  'contact': {},
  'address': {
    'location': [-5.929182099999999, 54.592808014285716],
    'formatted': ['21, Ormeau Avenue,', 'Belfast', 'BT2 8HD', 'United Kingdom']
  },
  'categories': [{
    'name': 'Tech Startup',
    'icon': 'https://ss3.4sqi.net/img/categories_v2/shops/technology_64.png'
  }],
  'website': '',
  'hours': [],
  'pictures': {},
  tasks: [
    getTask(5),
    getTask(6),
    getTask(7),
    getTask(8)
  ],
}, {
  '_id': '58261fa76740058d9be74882',
  'source': 'foursquare',
  'name': 'Liberty IT',
  'foursquareId': '4b680136f964a520a1632be3',
  'contact': {
    'twitter': 'liberty_it'
  },
  'address': {
    'location': [-5.92810470975273, 54.59349306140133],
    'formatted': ['24-26 Adelaide Street', 'Belfast', 'BT2 8GD', 'United Kingdom']
  },
  'categories': [{
    'name': 'Office',
    'icon': 'https://ss3.4sqi.net/img/categories_v2/building/default_64.png'
  }],
  'website': 'http://liberty-it.co.uk',
  'hours': [],
  'pictures': {
    'prefix': 'https://irs0.4sqi.net/img/general/',
    'suffix': '/16105247_4pjvoyWrFZNMmEzEMNJS8gahcts1X9wD67yFiYp2Ydg.jpg',
    'width': 1920,
    'height': 1081
  },
  tasks: [
    getTask(9),
    getTask(10),
    getTask(11)
  ],
}, {
  '_id': '58261faf6740058d9be74883',
  'source': 'foursquare',
  'name': 'ShopKeep',
  'foursquareId': '53161f34498efe0e844dacce',
  'contact': {},
  'address': {
    'location': [-5.928296569207635, 54.592778369687416],
    'formatted': ['United Kingdom']
  },
  'categories': [{
    'name': 'Tech Startup',
    'icon': 'https://ss3.4sqi.net/img/categories_v2/shops/technology_64.png'
  }],
  'website': '',
  'hours': [],
  'pictures': {},
  tasks: [
    getTask(12)
  ],
}, {
  '_id': '5851328c0c894f08a7d2d38d',
  'source': 'foursquare',
  'name': 'The Botanic Inn',
  'foursquareId': '4b490739f964a520b36226e3',
  'contact': {},
  'address': {
    'location': [
      -5.938351252496953,
      54.58106284226866
    ],
    'formatted': [
      '23-27 Malone Rd',
      'Belfast',
      'BT9 6RU',
      'United Kingdom'
    ]
  },
  'website': '',
  'hours': [],
  'pictures': {
    'prefix': 'https://irs3.4sqi.net/img/general/',
    'suffix': '/42970375_J8QbnKE2-2rCc3L_G06D0fIqqGUL2c1513jHBaiBnno.jpg',
    'width': 1386,
    'height': 1920
  },
  'categories': [
    {
      'name': 'Bar',
      'icon': 'https://ss3.4sqi.net/img/categories_v2/nightlife/pub_64.png'
    },
    {
      'name': 'Nightclub',
      'icon': 'https://ss3.4sqi.net/img/categories_v2/nightlife/nightclub_64.png'
    }
  ],
  tasks: [
    getTask(12)
  ],
}];
