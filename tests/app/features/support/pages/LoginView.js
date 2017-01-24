const {asserters} = require('wd');

class LoginView {
  constructor(driver) {
    this.driver = driver;
  }

  isDisplayed() {
    return this.driver.waitForElementByAccessibilityId('Login View', asserters.isDisplayed, 30000);
  }

  haveErrorMessage() {
    return this.driver.elementIfExists('accessibility id', 'Error Message')
      .then(el => {
        if (el === undefined) {
          return Promise.resolve(false);
        } else {
          return Promise.resolve(true);
        }
      });
  }
  getErrorMessage() {
    return this.driver.elementByAccessibilityId('Error Message').text();
  }
  getUsernameInput() {
    return this.driver.elementByAccessibilityId('Username Input');
  }
  getPasswordInput() {
    return this.driver.elementByAccessibilityId('Password Input');
  }

  getNotNow() {
    return this.driver.elementByAccessibilityId('Skip login');
  }

  fillUsername(text) {
    return this.getUsernameInput()
      .click()
      .sendKeys(text);
  }

  fillPassword(text) {
    return this.getPasswordInput()
      .click()
      .sendKeys(text);
  }

  login() {
    return this.driver.elementByXPath('//android.view.ViewGroup//android.widget.TextView[@text="Login"]')
      .click()
  }

  skipToMap() {
    return this.driver.elementByAccessibilityId('Skip login')
      .click();
  }
}

module.exports = LoginView;