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

const categorySchema = mongoose.Schema({
  name: String,
  icon: String,
}, {_id: false});

const venue = mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    foursquareId: String,
    source: mongoose.Schema.Types.Mixed,
    contact: Object,
    address: {
      type: venueSubModels.address,
      required: true,
    },
    website: String,
    categories: [categorySchema],
    hours: [{
      days: String,
      time: [String],
      _id: false,
    }],
    pictures: {
      prefix: String,
      suffix: String,
      width: Number,
      height: Number,
    },
    amenity: String,
    tasks: [venueTaskSchema],
    nbTasks: Number,
});

module.exports = {
  venue,
};
