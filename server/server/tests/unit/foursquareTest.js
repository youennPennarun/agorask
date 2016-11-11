/* global describe it before */
/* eslint-disable no-unused-expressions */

const expect = require('chai').expect;
const co = require('co');
const nock = require('nock');
const venueResponses = require('../data/foursquare/venueResponse');
const venueData = require('../data/venueData');
const Foursquare = require('../../services/foursquare/Foursquare');

const {FOURSQUARE_CLIENT_ID, FOURSQUARE_CLIENT_SECRET} = process.env;

describe('Venues', () => {
  before(function() {
    Object.keys(venueResponses).forEach(function(key) {
      nock('https://api.foursquare.com/v2/venues')
        .get(`/${key}`)
        .query({client_id: FOURSQUARE_CLIENT_ID, client_secret: FOURSQUARE_CLIENT_SECRET, v: 20161111})
        .reply(200, venueResponses[key]);
    });
    nock('https://api.foursquare.com/v2/venues')
        .get('/thisKeyIsNotValid')
        .query({client_id: FOURSQUARE_CLIENT_ID, client_secret: FOURSQUARE_CLIENT_SECRET, v: 20161111})
        .reply(404);
    nock('https://api.foursquare.com/v2/venues')
        .get('/broken')
        .query({client_id: FOURSQUARE_CLIENT_ID, client_secret: FOURSQUARE_CLIENT_SECRET, v: 20161111})
        .reply(500);
  });

  describe('Get a venue by id', () => {
    it('Should return a parsed venue 1', () => {
      return co(Foursquare.getVenueById('4bf58dd8d48988d11f941735'))
        .then(venue => {
          const venueCpy = Object.assign({}, venueData[0]);
          delete venueCpy._id;
          delete venueCpy.tasks;
          expect(venue).to.be.deep.equals(venueCpy);
        });
    });
    it('Should return a parsed venue 2', () => {
      return co(Foursquare.getVenueById('4c1b57c155e4c9b6af1f4923'))
        .then(venue => {
          const venueCpy = Object.assign({}, venueData[3]);
          delete venueCpy._id;
          delete venueCpy.tasks;
          expect(venue).to.be.deep.equals(venueCpy);
        });
    });
    it('Should return null if the venue doesn\'t exists', () => {
      return co(Foursquare.getVenueById('broken'))
        .then(() => {
          throw new Error('Should have thrown an error');
        })
        .catch(e => {
          expect(e.message).to.be.equal('Failed to call foursquare API (status: 500)');
        });
    });
  });
});

