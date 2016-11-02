const users = require('./userData');

module.exports = [
  {
    _id: '581411784d79072f3b799aca',
    title: 'Question 2',
    postedBy: {
      userId: users[9]._id,
      username: users[9].username,
    },
    answers: [
      {
        answer: 'Answer 1',
        postedBy: {
          userId: users[5]._id,
          username: users[5].username,
        },
        date: '2016-10-29T03:27:25.527Z',
      },
      {
        answer: 'Answer 2',
        postedBy: {
          userId: users[4]._id,
          username: users[4].username,
        },
        date: '2016-10-29T03:27:25.527Z',
      },
      {
        answer: 'Answer 3',
        postedBy: {
          userId: users[10]._id,
          username: users[10].username,
        },
        date: '2016-10-29T03:27:25.527Z',
      },
    ],
    date: '2016-10-29T03:27:25.527Z',
    venue: '581773476d568ac7723e1bae',
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
        answer: 'Answer 1',
        postedBy: {
          userId: users[0]._id,
          username: users[0].username,
        },
        date: '2016-10-29T03:27:25.527Z',
      },
    ],
    date: '2016-10-29T03:27:25.527Z',
    venue: '581773476d568ac7723e1bae',
  },
  {
    _id: '581411d6b0fce75c59f74d6c',
    title: 'Question 4',
    postedBy: {
      userId: users[4]._id,
      username: users[4].username,
    },
    answers: [],
    date: '2016-10-29T03:27:25.527Z',
    venue: '5817738f6d568ac7723e1baf',
  },
  {
    _id: '581411e0b0fce75c59f74d6d',
    title: 'Question 5',
    postedBy: {
      userId: users[6]._id,
      username: users[6].username,
    },
    answers: [],
    date: '2016-10-29T03:27:25.527Z',
    venue: '5817739f6d568ac7723e1bb2',
  },
  {
    _id: '5819d362432c548620b9093b',
    title: 'Question 6',
    postedBy: {
      userId: users[10]._id,
      username: users[10].username,
    },
    answers: [],
    date: '2016-10-29T03:27:25.527Z',
    venue: '5817739f6d568ac7723e1bb2',
  },
  {
    _id: '5819d35c432c548620b9093a',
    title: 'Question 7',
    postedBy: {
      userId: users[7]._id,
      username: users[7].username,
    },
    answers: [],
    date: '2016-10-29T03:27:25.527Z',
    venue: '5817745c6d568ac7723e1bb9',
  },
  {
    _id: '5819d357432c548620b90939',
    title: 'Question 8',
    postedBy: {
      userId: users[2]._id,
      username: users[2].username,
    },
    answers: [],
    date: '2016-10-29T03:27:25.527Z',
    venue: '5817745c6d568ac7723e1bb9',
  },
];
