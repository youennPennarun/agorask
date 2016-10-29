const mongoose = require('mongoose');


const shortUser = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
}, { _id: false });
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
    type: String,
  },
});



module.exports = mongoose.model('Task', task);
