const mongoose = require('mongoose');

const address = mongoose.Schema({
  location: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  houseNumber: mongoose.Schema.Types.String,
  postcode: mongoose.Schema.Types.String,
  street: mongoose.Schema.Types.String,
}, { _id: false });

module.exports = {
  address,
};
