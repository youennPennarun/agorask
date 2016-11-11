/* global describe it */
/* eslint-disable no-unused-expressions */

const expect = require('chai').expect;
const co = require('co');
const Venue = require('../../services/Venue');
const venuesData = require('../data/venueData');
const haversine = require('haversine');
const cleanMongooseObject = require('../cleanMongooseObject');


function expectDistanceToBeOk(venue, distanceMax) {
  expect(venue).to.have.property('address');
  expect(venue.address).to.have.property('location');
  const distance0 = haversine({
    latitude: 54.5927931,
    longitude: -5.9283928,
  }, {
    latitude: venue.address.location[1],
    longitude: venue.address.location[0],
  }, {unit: 'meter'});
  expect(distance0).to.be.below(distanceMax);
}

describe('Venues', () => {
  describe('Searh tasks in circle with tasks', () => {
    it('Should venues with tasks within 200 meter of [-5.9283928, 54.5927931] with a radius of 0.2 km', () => {
      return co(Venue.getVenuesWithinRadiusWithTasks([-5.9283928, 54.5927931], 0.2))
        .then(venues => {
          expect(venues).to.be.an.Array;
          venues.forEach(venue => {
            expectDistanceToBeOk(venue, 200);
            expect(venue).to.have.property('tasks');
            expect(venue.tasks).to.have.length.of.at.least(1);
          });
        });
    });
  });

  describe('Get task by id', () => {
    it('Should return a task', () => {
      return co(Venue.getVenue('581773476d568ac7723e1bae'))
        .then(venue => {
          const cleaned = cleanMongooseObject(venue);
          expect(cleaned).to.deep.equal(venuesData[0]);
        })
        .catch(err => {
          throw new Error(err);
        });
    });
  });
});

