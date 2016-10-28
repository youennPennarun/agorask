/* global describe, before */
/* eslint-disable global-require */

const requireTests = require('../../../scripts/requireTests');
try {
  // eslint-disable-next-line global-require
  require('dotenv').config();
} catch(e) {
  console.log('unable to load .env file');
}

process.env.MONGO_URL = process.env.MONGO_URL_TEST || process.env.MONGO_URL;
const connection = require('../../utils/mongo/connect');

const testsFiles = [
  {name: 'auth', file: './AuthentificationTest'},
  {name: 'user', file: './userServiceTest'},
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
