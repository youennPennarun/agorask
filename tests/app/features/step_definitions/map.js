var {defineSupportCode} = require('cucumber');
const {asserters} = require('wd');
const expect = require('chai').expect;

const path = require('path');


defineSupportCode(function({Given, When, Then}) {

  When(/I search for "([^"]*)"/, function (query) {
    return this.MapPage.searchFor(query);
  });

  Then(/([0-9]+) markers will be visible/, function(nbMarkersExpected) {
    return this.MapPage.getMarkers()
      .then(markers => {
        expect(markers).to.have.lengthOf(nbMarkersExpected);

        return Promise.resolve();
      })
  });

  Then(/at least([0-9]+) markers will be visible/, function(nbMarkersExpected) {
    return this.MapPage.getMarkers()
      .then(markers => {
        expect(markers).to.have.length.of.at.least(nbMarkersExpected);

        return Promise.resolve();
      })
  });

  When(/I clear the search/, function () {
    return this.MapPage.clearQuery();
  });

  Then(/the search query should be "([^"]*)"/, function (expectedQuery) {
    return this.MapPage.getSearchInputText()
      .then(query => {
        expect(query).to.be.equal(expectedQuery);
        return Promise.resolve(); 
      });
  });
});