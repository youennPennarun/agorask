const mongoose = require('mongoose');

const userSchemas = require('./UserSchemas');
const venueSchemas = require('./VenueSchemas');
const taskSchemas = require('./TaskSchemas');

const User = mongoose.model('User', userSchemas.user);
const Venue = mongoose.model('Venue', venueSchemas.venue);
const Task = mongoose.model('Task', taskSchemas.task);

module.exports = {
  User,
  Venue,
  Task,
};