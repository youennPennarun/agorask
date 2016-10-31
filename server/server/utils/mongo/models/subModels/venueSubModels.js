const mongoose = require('mongoose');

const address = mongoose.Schema({
  location: {
    type: [Number], // [longitude, latitude]
    index: '2d',
    required: true,
  },
  houseNumber: mongoose.Schema.Types.String,
  postcode: mongoose.Schema.Types.String,
  street: mongoose.Schema.Types.String,
}, { _id: false });

module.exports = {
  address,
};
