const users = require('./userData');
const venues = require('./venueData');

module.exports = [
  {
    _id: '581411784d79072f3b799ac9',
    title: 'At what time does it open',
    postedBy: {
      userId: users[0]._id,
      username: users[0].username,
    },
    answers: [
      {
        answer: 'At 09:00am',
        postedBy: {
          userId: users[1]._id,
          username: users[1].username,
        },
        date: '2016-10-29T03:27:25.527Z',
      },
    ],
    date: '2016-10-29T03:24:08.671Z',
    venue: {
      _id: venues[5]._id,
      address: venues[5].address,
      name: venues[5].name,
    },
  },
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
    venue: {
      _id: venues[8]._id,
      address: venues[8].address,
      name: venues[8].name,
    },
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
    venue: {
      _id: venues[0]._id,
      address: venues[0].address,
      name: venues[0].name,
    },
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
    venue: {
      _id: venues[6]._id,
      address: venues[6].address,
      name: venues[6].name,
    },
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
    venue: {
      _id: venues[2]._id,
      address: venues[2].address,
      name: venues[2].name,
    },
  },
];
