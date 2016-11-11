const mongoose = require('mongoose');

const address = mongoose.Schema({
  location: {
    type: [Number], // [longitude, latitude]
    index: '2d',
    required: true,
  },
  formatted: [String],
}, { _id: false });
module.exports = {
  address,
};
