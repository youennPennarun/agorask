const mongoose = require('mongoose');

module.exports = {
  User: require('./UserModel'),
  Task: require('./TaskModel'),
  Venue: require('./VenueModel'),
};