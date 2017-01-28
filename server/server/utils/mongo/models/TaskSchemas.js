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
}, { _id: false });

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
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});



module.exports = {
  task,
};
