const users = require('./userData');
const venues = require('./venueData');
const tasks = require('./taskData');
const applications = require('./applicationData');

function resolve(data) {
  return (data.resolve) ? data.resolve() : data.data
}

module.exports = {
  User: resolve(users),
  Venue: resolve(venues),
  Task: resolve(tasks),
  Application: resolve(applications),
};
