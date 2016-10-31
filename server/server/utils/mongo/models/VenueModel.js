const mongoose = require('mongoose');
const venueSubModels = require('./subModels/venueSubModels');

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
});

module.exports = mongoose.model('Venue', venue);
