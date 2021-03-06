const users = require('./userData').data;

function Venue(venueId) {
  return (venues) => {
    const data = venues.find(v => v._id === venueId);
    if (!data) throw new Error(`No venue with id ${venueId}`);
    return {
      _id: venueId,
      location: data.address.location,
    };
  };
}

const data = [
  {
    _id: '581411784d79072f3b799aca',
    title: 'Do they have live music?',
    postedBy: {
      userId: users[9]._id,
      username: users[9].username,
    },
    answers: [
      {
        _id: '589f51c2c5add0a4f0ea5ebf',
        answer: 'Yes, there is regularly lives show',
        postedBy: {
          userId: users[5]._id,
          username: users[5].username,
        },
        date: '2016-10-29T03:27:25.527Z',
        rating: 0,
        ratingList: [],
      },
      {
        _id: '589f51d4c5add0a4f0ea5ec0',
        answer: 'Yeah! There is sometimes live music in Limelight 1 and 2. Limelight 1 hosted live shows from THE BREEDERS, DISCLOSURE and STEVE EARLE & PRIMAL SCREAM, and in Limelight 2 had shows with THE STROKES, MANIC STREET PREACHERS, JOE STRUMMER, BLUR',
        postedBy: {
          userId: users[4]._id,
          username: users[4].username,
        },
        date: '2016-10-29T03:27:25.527Z',
        rating: 1,
        ratingList: [{
          rating: 1,
          user: {
            _id: users[5]._id,
            username: users[5].username,
          },
        }],
      },
      {
        _id: '58aadf7b26722092e3c8bd66',
        answer: 'No sux so lame grumble grumble!',
        postedBy: {
          userId: users[10]._id,
          username: users[10].username,
        },
        date: '2016-10-29T03:27:25.527Z',
        rating: 0,
        ratingList: [],
      },
    ],
    date: '2016-10-29T03:27:25.527Z',
    venue: Venue('581773476d568ac7723e1bae'),
  },
  {
    _id: '581411784d79072f3b799acb',
    title: 'Question 3',
    postedBy: {
      userId: users[10]._id,
      username: users[10].username,
    },
    answers: [
      {
        _id: '589f51ddc5add0a4f0ea5ec1',
        answer: 'No sux so lame grumble grumble!',
        postedBy: {
          userId: users[10]._id,
          username: users[10].username,
        },
        date: '2016-10-29T03:27:25.527Z',
        rating: 0,
        ratingList: [],
      },
    ],
    date: '2016-10-10T03:27:25.527Z',
    venue: Venue('581773476d568ac7723e1bae'),
  },
  {
    _id: '581411d6b0fce75c59f74d6c',
    title: 'Question 4',
    postedBy: {
      userId: users[4]._id,
      username: users[4].username,
    },
    answers: [],
    date: '2016-12-25T06:27:25.527Z',
    venue: Venue('5817738f6d568ac7723e1baf'),
  },
  {
    _id: '581411e0b0fce75c59f74d6d',
    title: 'Question 5',
    postedBy: {
      userId: users[6]._id,
      username: users[6].username,
    },
    answers: [],
    date: '2016-05-01T03:27:25.527Z',
    venue: Venue('5817739f6d568ac7723e1bb2'),
  },
  {
    _id: '5819d362432c548620b9093b',
    title: 'Question 6',
    postedBy: {
      userId: users[10]._id,
      username: users[10].username,
    },
    answers: [],
    date: '2016-04-20T03:25:05.527Z',
    venue: Venue('5817739f6d568ac7723e1bb2'),
  },
  {
    _id: '5819d35c432c548620b9093a',
    title: 'Question 7',
    postedBy: {
      userId: users[7]._id,
      username: users[7].username,
    },
    answers: [],
    date: '2016-02-03T05:27:25.527Z',
    venue: Venue('5817738f6d568ac7723e1baf'),
  },
  {
    _id: '5819d357432c548620b90939',
    title: 'Question 8',
    postedBy: {
      userId: users[2]._id,
      username: users[2].username,
    },
    answers: [],
    date: '2016-04-24T04:24:24.527Z',
    venue: Venue('5817738f6d568ac7723e1baf'),
  },
  {
    _id: '5826210e6740058d9be74889',
    title: 'When does it open?',
    postedBy: {
      userId: users[2]._id,
      username: users[2].username,
    },
    answers: [],
    date: '2016-07-12T01:37:25.527Z',
    venue: Venue('5817738f6d568ac7723e1baf'),
  },
  {
    _id: '582621076740058d9be74888',
    title: 'Is there food?',
    postedBy: {
      userId: users[2]._id,
      username: users[2].username,
    },
    answers: [],
    date: '2016-11-05T08:20:20.507Z',
    venue: Venue('5817738f6d568ac7723e1baf'),
  },
  {
    _id: '582621026740058d9be74887',
    title: 'Are the people nice?',
    postedBy: {
      userId: users[2]._id,
      username: users[2].username,
    },
    answers: [],
    date: '2016-12-30T05:20:12.527Z',
    venue: Venue('5817738f6d568ac7723e1baf'),
  },
  {
    _id: '582620f96740058d9be74886',
    title: 'Could you find a question to ask please?',
    postedBy: {
      userId: users[2]._id,
      username: users[2].username,
    },
    answers: [
      {
        _id: '589f51eac5add0a4f0ea5ec2',
        answer: 'Answer 1',
        postedBy: {
          userId: users[0]._id,
          username: users[0].username,
        },
        date: '2016-10-29T03:27:25.527Z',
        rating: 0,
        ratingList: [],
      },
    ],
    date: '2016-09-09T01:00:00.527Z',
    venue: Venue('5817738f6d568ac7723e1baf'),
  },
  {
    _id: '582620f46740058d9be74885',
    title: 'Is it cheap?',
    postedBy: {
      userId: users[2]._id,
      username: users[2].username,
    },
    answers: [],
    date: '2016-10-17T07:02:08.527Z',
    venue: Venue('5817738f6d568ac7723e1baf'),
  },
  {
    _id: '582620ed6740058d9be74884',
    title: 'Is the food good?',
    postedBy: {
      userId: users[3]._id,
      username: users[3].username,
    },
    answers: [],
    date: '2016-12-20T01:07:06.527Z',
    venue: Venue('58261faf6740058d9be74883'),
  },
  {
    _id: '5851396a9291023db21e5804',
    title: 'Do they have good cocktails?',
    postedBy: {
      userId: users[3]._id,
      username: users[3].username,
    },
    answers: [],
    date: '2016-10-24T01:05:54.527Z',
    venue: Venue('5851328c0c894f08a7d2d38d'),
  },
  {
    _id: '5851556ad7a242a6d57bb017',
    title: 'Do they sell burgers?',
    postedBy: {
      userId: users[2]._id,
      username: users[2].username,
    },
    answers: [],
    date: '2016-10-24T01:05:55.527Z',
    venue: Venue('5851328c0c894f08a7d2d38d'),
  },
  {
    _id: '58515571d7a242a6d57bb018',
    title: 'Do they have wine?',
    postedBy: {
      userId: users[1]._id,
      username: users[1].username,
    },
    answers: [],
    date: '2016-10-24T01:05:56.527Z',
    venue: Venue('5851328c0c894f08a7d2d38d'),
  },
  {
    _id: '58515578d7a242a6d57bb019',
    title: 'Is it usually crowded?',
    postedBy: {
      userId: users[1]._id,
      username: users[1].username,
    },
    answers: [],
    date: '2016-10-24T01:05:57.527Z',
    venue: Venue('5851328c0c894f08a7d2d38d'),
  },
  {
    _id: '58515582d7a242a6d57bb01a',
    title: 'Is there live music?',
    postedBy: {
      userId: users[3]._id,
      username: users[3].username,
    },
    answers: [],
    date: '2016-10-24T01:05:58.527Z',
    venue: Venue('5851328c0c894f08a7d2d38d'),
  },
  {
    _id: '58515588d7a242a6d57bb01b',
    title: 'Is it open on sunday?',
    postedBy: {
      userId: users[4]._id,
      username: users[4].username,
    },
    answers: [],
    date: '2016-10-24T01:05:59.527Z',
    venue: Venue('5851328c0c894f08a7d2d38d'),
  },
  {
    _id: '58515588d7a242a6d57bb01c',
    title: 'At what time does it closes?',
    postedBy: {
      userId: users[4]._id,
      username: users[4].username,
    },
    answers: [],
    date: '2016-10-24T01:05:50.527Z',
    venue: Venue('5851328c0c894f08a7d2d38d'),
  },
  {
    _id: '58515588d7a242a6d57bb01d',
    title: 'Do they take reservations?',
    postedBy: {
      userId: users[3]._id,
      username: users[3].username,
    },
    answers: [],
    date: '2016-10-24T01:05:51.527Z',
    venue: Venue('5851328c0c894f08a7d2d38d'),
  },
];

module.exports = {
  resolve: () => {
    const venues = require('./venueData').data;
    return data.map(task => Object.assign({}, task, {venue: task.venue(venues)}));
  },
  data,
};
