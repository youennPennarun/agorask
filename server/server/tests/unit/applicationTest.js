/* global describe it before */
/* eslint-disable no-unused-expressions */

const expect = require('chai').expect;
const co = require('co');
const path = require('path')


const MockBox = require('../data/box/mockApi.js');

const appTestPath = path.join(__dirname, '../data/empty.apk');
const Application = require('../../services/Application');
const { User } = require('../data');

const userTest = User[10];

describe('Application', () => {
  before(() => {
    MockBox.mock();
  });

  describe('Get application name', () => {
    it('Should get correctly parse the name', () => {
      expect(Application.getApplicationFullName('0.1.0')).to.be.equals('agorask_0.1.0.apk');
      expect(Application.getApplicationFullName('10.0.8')).to.be.equals('agorask_10.0.8.apk');
    });
  });

  describe('New Release', () => {
    it('Should store the application and return the Application object', (done) => {
      const releaseDate = Date.now();
      const version = '0.0.1';
      const type = 'release';
      co(Application.newRelease({id: userTest._id}, releaseDate, version, type, appTestPath))
        .then(app => {
          expect(app).to.have.property('releaseDate');
          expect(app.releaseDate.toString()).to.be.equal(new Date(releaseDate).toString());
          expect(app).to.have.property('version', version);
          expect(app).to.have.property('type', type);
          done();
        }).catch((e = new Error('Test failed')) => {
          console.log('Should\'t have thrown an error');
          console.log(e)
          done(e);
        });
    });
  });
});
