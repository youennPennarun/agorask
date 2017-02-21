const mongoose = require('mongoose');
const {shortUser} = require('./UserSchemas');

const answer = mongoose.Schema({
  answer: {
    type: String,
    required: true,
  },
  postedBy: {
    type: shortUser,
    required: true,
  },
  date: {
    type: mongoose.Schema.Types.Date,
    required: true,
  },
  rating: {
    type: mongoose.Schema.Types.Number,
    required: true,
  },
  ratingList: [{
    user: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      username: {
        type: mongoose.Schema.Types.String,
        required: true,
      },
    },
    rating: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
  }],
});

const task = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  postedBy: {
    type: shortUser,
    required: true,
  },
  answers: [answer],
  date: {
    type: mongoose.Schema.Types.Date,
    required: true,
  },
  venue: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    location: {
      type: [Number], // [longitude, latitude]
      index: '2d',
      required: true,
    },
  },
});



module.exports = {
  task,
};
