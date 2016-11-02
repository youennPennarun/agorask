/* global describe, it */
const expect = require('chai').expect;
const co = require('co');
const fetch = require('node-fetch');
const venuesData = require('../data/venueData');
const cleanMongooseObject = require('../cleanMongooseObject');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN1bW1lciIsImlhdCI6MTQ3ODA5MjAxNn0.Tcy-ZLrEv5mhbk5JcTsWXxAvjzjlUEwxR-RwGY4Ork8';

describe('Venue Tests', () => {
  describe('get a venue by Id', () => {
    it('Should throw an error if the user is not loggedin', () => {
      return co(function* () {
        const response = yield fetch(`http://localhost:3000/venues/581773476d568ac7723e1bae`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
        expect(response.status).to.be.equal(401);
      });
    });
    it('Should return a complete venue', () => {
      return co(function* () {
        const response = yield fetch(`http://localhost:3000/venues/581773476d568ac7723e1bae?token=${token}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
        expect(response.status).to.be.equal(200);
        return response.json();
      }).then(json => {
        expect(json).to.deep.equal(Object.assign({}, {__v: 0}, venuesData[0]));
      });
    });
  });
  describe('Get venues close to a lat,lng ', () => {
    it('Should throw an error if the user is not loggedin', () => {
      return co(function* () {
        const response = yield fetch(`http://localhost:3000/venues/`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lng: -5.9283928,
            lat: 54.5927931,
            radius: 0.200,
          }),
        });
        expect(response.status).to.be.equal(401);
      });
    });
    it('get close venues', () => {
      return co(function* () {
        const response = yield fetch(`http://localhost:3000/venues/?token=${token}`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lng: -5.9283928,
            lat: 54.5927931,
            radius: 0.200,
          }),
        });
        expect(response.status).to.be.equal(200);
      });
    });
    it('Should throw 400 is missing latitude', () => {
      return co(function* () {
        const response = yield fetch(`http://localhost:3000/venues/?token=${token}`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lng: -5.9283928,
            radius: 0.200,
          }),
        });
        expect(response.status).to.be.equal(400);
      });
    });
    it('Should throw 400 is missing longitude', () => {
      return co(function* () {
        const response = yield fetch(`http://localhost:3000/venues/?token=${token}`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lat: 54.5927931,
            radius: 0.200,
          }),
        });
        expect(response.status).to.be.equal(400);
      });
    });
    it('Should throw 400 is missing radius', () => {
      return co(function* () {
        const response = yield fetch(`http://localhost:3000/venues/?token=${token}`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lat: 54.5927931,
            lng: -5.9283928,
          }),
        });
        expect(response.statusText).to.be.equal('Bad Request');
      });
    });
  });

  describe('Searh tasks in circle with tasks', () => {
    it('Should venues with tasks within 200 meter of [-5.9283928, 54.5927931] with a radius of 0.2 km', () => {
        return co(function* () {
        const response = yield fetch(`http://localhost:3000/venues/?token=${token}`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lat: 54.5927931,
            lng: -5.9283928,
            onlyWithTasks: true,
          }),
        });
        expect(response.status).to.be.equal(200);
        const venues = yield response.json();
        venues.forEach(venue => {
          expect(venue.tasks).to?have.length.above(1);
        });
      });
    });
  });

});
