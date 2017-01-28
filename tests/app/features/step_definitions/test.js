var {defineSupportCode} = require('cucumber');
const {asserters} = require('wd');


defineSupportCode(function({Given, When, Then}) {
  Given('I am on the login screen', function() {
    return this.LoginPage.isDisplayed();
  });

  When(/I fill the username with "([^"]*)"/, function (text) {
    return this.LoginPage.fillUsername(text);
  });
  When(/I fill the password with "([^"]*)"/, function (text) {
    return this.LoginPage.fillPassword(text);
  });
  When('I click on login', function () {
    return this.LoginPage.login();
  });

  Then(/I should see an error that say "([^"]*)"/, function (text) {
    return this.LoginPage.haveErrorMessage()
      .then(exists => {
        if (exists) {
          return Promise.resolve();
        } else {
          return Promise.reject(new Error('No error is displayed'));
        }
      })
      .then(() => this.LoginPage.getErrorMessage())
      .then(message => {
        return message === text ?
          Promise.resolve() :
          Promise.reject(new Error(`Expecting error to have value "${text}" but got "${message}"`));
      });
  });

  When('I click on Not now', function () {
    return this.LoginPage.skipToMap();
  });

  Then('the map will show', function () {
    return this.driver.elementByAccessibilityId('Google Map')
  });
});