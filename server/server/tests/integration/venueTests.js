/* global describe, it */
const chai = require('chai');
const co = require('co');
const path = require('path');
const fetchQL = require('./graphFetch');
const {getVenueById, getVenuesInRadius} = require('./queries/venues');
const snapshot = require('chai-jest-snapshot');

const expect = chai.expect;
chai.use(snapshot);

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN1bW1lciIsImlhdCI6MTQ3ODA5MjAxNn0.Tcy-ZLrEv5mhbk5JcTsWXxAvjzjlUEwxR-RwGY4Ork8';

describe('Venue Tests', () => {
  describe('get a venue by Id', () => {
    it('Should return a complete venue', () => {
      return co(function* () {
        const response = yield fetchQL(getVenueById, {id: '581773476d568ac7723e1bae'})
        expect(response.status).to.be.equal(200);
        return response.json();
      }).then(json => {
        const snapshotPath = path.join(__dirname, 'venue.snap');
        const snapshotName = 'Should return a complete venue';
        expect(json).to.matchSnapshot(snapshotPath, snapshotName);
      });
    });
  });
  describe('Get venues with tasks close to a lat,lng ', () => {
    it('get close venues', () => {
      return co(function* () {
        const response = yield fetchQL(getVenuesInRadius, {
          lng: -5.9283928,
          lat: 54.5927931,
          radius: 0.200,
        });
        expect(response.status).to.be.equal(200);
        return response.json();
      }).then(json => {
        const snapshotPath = path.join(__dirname, 'venue.snap');
        const snapshotName = 'Get venues within circle';
        expect(json).to.matchSnapshot(snapshotPath, snapshotName);
      });
    });
  });
});
