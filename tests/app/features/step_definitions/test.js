var {defineSupportCode} = require('cucumber');
const {asserters} = require('wd');

const path = require('path');


defineSupportCode(function({Given, When, Then}) {
  When(/I take a screenshot named "([^"]+)"/, function (fileName) {
    const fileFullName = path.join(__dirname, `../../${fileName}.png`)
    return this.driver.saveScreenshot(fileName)
      .then((a, b) => {
        return Promise.resolve();
      })
  });
});