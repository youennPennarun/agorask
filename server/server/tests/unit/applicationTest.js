/* global describe it before */
/* eslint-disable no-unused-expressions */

const expect = require('chai').expect;
const co = require('co');
const path = require('path')


const MockBox = require('../data/box/mockApi.js');

const appTestPath = path.join(__dirname, '../data/empty.apk');
const Application = require('../../services/Application');
const { User, Application: applicationData } = require('../data');

const userTest = User[10];

const LAST_VERSION = '1.0.1';

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
      const version = LAST_VERSION;
      const type = 'release';
      co(Application.newRelease({id: userTest._id}, releaseDate, version, type, appTestPath))
        .then(app => {
          expect(app).to.have.property('releaseDate');
          expect(app.releaseDate.toString()).to.be.equal(new Date(releaseDate).toString());
          expect(app).to.have.property('version', version);
          expect(app).to.have.property('type', type);
          expect(app).to.have.property('boxId');
          expect(app).to.have.property('fileName');
          expect(app).to.have.property('downloadUrl');
          done();
        }).catch((e = new Error('Test failed')) => {
          console.log('Should\'t have thrown an error');
          console.log(e);
          done(e);
        });
    });
    it('Should throw an error if the user have no box tokens', (done) => {
      const releaseDate = Date.now();
      const version = LAST_VERSION;
      const type = 'release';
      co(Application.newRelease({id: User[0]._id}, releaseDate, version, type, appTestPath))
        .then(() => {
          done('Should have thrown an error');
        }).catch(e => {
          expect(e).to.have.property('message', 'No Box tokens for this user');
          done();
        });
    });
  });

  describe('Get application version', () => {
    it('Should return the last uploaded version', (done) => {
      co(Application.getApplicationVersion())
        .then(version => {
          expect(version).to.be.equal(LAST_VERSION);
          done();
        }).catch((e = 'Should not have thrown an error') => {
          done(e);
        });
    });
  });

  describe('Get download link', () => {
    it('Should return the last release download link', (done) => {
      co(Application.getDownloadLink())
        .then(downloadLink => {
          expect(downloadLink).to.be.equal(MockBox.createShareLinkResponse.shared_link.url);
          done();
        }).catch((e = 'Should not have thrown an error') => {
          done(e);
        });
    });
    it('Should return the last dev version download link', (done) => {
      co(Application.getDownloadLink('dev'))
        .then(downloadLink => {
          expect(downloadLink).to.be.equal(applicationData[1].downloadUrl);
          done();
        }).catch((e = 'Should not have thrown an error') => {
          done(e);
        });
    });
    it('Should return the last release download link with the version 0.0.1', (done) => {
      co(Application.getDownloadLink('release', '0.0.1'))
        .then(downloadLink => {
          expect(downloadLink).to.be.equal(applicationData[0].downloadUrl);
          done();
        }).catch((e = 'Should not have thrown an error') => {
          done(e);
        });
    });
    it('Should return the newest download link with the version 0.0.1 if no type is specified', (done) => {
      co(Application.getDownloadLink(undefined, '0.0.1'))
        .then(downloadLink => {
          expect(downloadLink).to.be.equal(applicationData[1].downloadUrl);
          done();
        }).catch((e = 'Should not have thrown an error') => {
          done(e);
        });
    });
    it('Should return null if there is no application of the type passed in parameter', (done) => {
      co(Application.getDownloadLink('unknownType'))
        .then(downloadLink => {
          expect(downloadLink).to.be.equal(null);
          done();
        }).catch((e = 'Should not have thrown an error') => {
          done(e);
        });
    });
    it('Should return null if there is no application with the version passed in parameter', (done) => {
      co(Application.getDownloadLink(undefined, 'a.a.a'))
        .then(downloadLink => {
          expect(downloadLink).to.be.equal(null);
          done();
        }).catch((e = 'Should not have thrown an error') => {
          done(e);
        });
    });
  });
});
