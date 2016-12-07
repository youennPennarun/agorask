/* global describe, before */
/* eslint-disable global-require */

require('dotenv').config({silent: true});

console.log(process.env.ENV)
const requireTests = require('../../../scripts/requireTests');

const app = require('../../app');

const testsFiles = [
  {name: 'user', file: './userTests'},
  {name: 'venue', file: './venueTests'},
  {name: 'task', file: './taskTests'},
  ];



describe('Integration Tests', () => {
  before(done => {
    done();
  });

  // Run a specific test with npm run test:integration -- --tests test1[,test2,test3,...]
  requireTests(testsFiles, __dirname);
});
