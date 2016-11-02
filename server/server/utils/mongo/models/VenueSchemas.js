const mongoose = require('mongoose');
const venueSubModels = require('./subModels/venueSubModels');

const venueTaskSchema = mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  nbAnswers: {
    type: mongoose.Schema.Types.Number,
    required: true,
  },
}, {required: true});

const venue = mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    source: mongoose.Schema.Types.Mixed,
    address: {
      type: venueSubModels.address,
      required: true,
    },
    amenity: String,
    tasks: [venueTaskSchema],
});

module.exports = {
  venue,
};
