const Task = require('../services/Task');
const Authentification = require('../services/Authentification');
const ngeohash = require('ngeohash');


const getTasksNearMe = async function () {
  const {geohash, radius = 100, token} = this.query;
  if (!geohash) return this.throw('BadRequest', 400);
  let userId;
  const payload = Authentification.isTokenValid(token);
  if (token !== false) {
    userId = payload.id;
  }
  const fields = ['_id', 'title'];
  this.body = await Task.getTasksNearMe(ngeohash.decode(geohash), radius, userId, fields);
};

module.exports = {
  getTasksNearMe,
};
