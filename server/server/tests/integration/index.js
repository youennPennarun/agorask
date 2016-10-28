/* global describe, before */
/* eslint-disable global-require */

require('dotenv').config({silent: true});

console.log(process.env.ENV)
const requireTests = require('../../../scripts/requireTests');

const app = require('../../app');

const testsFiles = [
  {name: 'user', file: './userTests'},
  ];



describe('Integration Tests', () => {
  before(done => {
    done();
  });

  requireTests(testsFiles, __dirname);
});
