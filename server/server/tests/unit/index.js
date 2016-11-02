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

  requireTests(testsFiles, __dirname);
});
