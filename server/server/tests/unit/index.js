/* global describe, before */
/* eslint-disable global-require */

const requireTests = require('../../../scripts/requireTests');
require('dotenv').config({silent: true});
process.env.MONGO_URL = process.env.MONGO_URL_TEST || process.env.MONGO_URL;
const connection = require('../../utils/mongo/connect');

const testsFiles = [
  {name: 'auth', file: './AuthentificationTest'},
  {name: 'user', file: './userServiceTest'},
  {name: 'task', file: './TaskTest'},
  {name: 'venue', file: './VenueTest'},
  {name: 'foursquare', file: './foursquareTest'},
  {name: 'application', file: './applicationTest'},
  ];



describe('Unit Tests', () => {
  before(done => {
    connection.on('error', () => {
      done('Unable to connect to mongo');
    });
    connection.once('open', function() {
      done();
    });
  });
  // Run a specific test with npm run test:unit -- --tests test1[,test2,test3,...]
  requireTests(testsFiles, __dirname);
});
