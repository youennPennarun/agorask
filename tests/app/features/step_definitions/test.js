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

  Then('I should see an error', function () {
    throw new Error('not implemented yet')
  });

  When('I click on Not now', function () {
    return this.LoginPage.skipToMap();
  });

  Then('the map will show', function () {
    return this.driver.elementByAccessibilityId('Google Map')
  });
});