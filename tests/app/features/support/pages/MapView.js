const {asserters} = require('wd');

class MapView {
  constructor(driver) {
    this.driver = driver;
  }

  isDisplayed() {
    return this.driver.waitForElementByAccessibilityId('Google Map', asserters.isDisplayed, 30000);
  }
  getMap() {
    return this.driver.elementByAccessibilityId('Google Map');
  }
  getMarkers() {
    return this.driver.elementsByXPath('//*[@content-desc="Google Map"]/*');
  }
  getSearchInput() {
    return this.driver.elementByAccessibilityId('Search Input');
  }

  getSearchInputText() {
    return this.getSearchInput()
      .then(elem => Promise.resolve(elem.text()))
  }

  searchFor(query) {
    return new Promise((resolve, reject) => {
      return this.getSearchInput()
        .click()
        .sendKeys(query)
        .then(() => {
          setTimeout(() => resolve(), 5000);
        });
    });
  }

  clearQuery() {
    return this.driver.elementByAccessibilityId('Clear Query Button')
      .click();
  }
}

module.exports = MapView;