const Task = require('../services/Task');
const Authentification = require('../services/Authentification');
const ngeohash = require('ngeohash');


const getTasksNearMe = function* () {
  const {geohash, radius = 100, token} = this.query;
  if (!geohash) return this.throw('BadRequest', 400);
  let userId;
  const payload = Authentification.isTokenValid(token);
  if (token !== false) {
    userId = payload.id;
  }
  this.body = yield Task.getTasksNearMe(ngeohash.decode(geohash), radius, userId);
};

module.exports = {
  getTasksNearMe,
};
