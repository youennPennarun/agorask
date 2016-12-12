const venue = require('./venue');
const task = require('./task');
const user = require('./user');


module.exports = {
  venue: venue.venue,
  searchVenues: venue.searchVenues,
  venuesWithinRadius: venue.venuesWithinRadius,
  task: task.task,
  user: user.user,
};
