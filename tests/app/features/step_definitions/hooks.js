var {defineSupportCode} = require('cucumber');
const {pushNewScreenshots} = require('../support/utils/updateSnaphots');


defineSupportCode(function({Before, After, registerHandler}) {
  

  Before(function(scenarioResult) {
    const before = (this.config.before) ? this.config.before : (() => Promise.resolve());
    
    return before(this.caps)
      .then(() => this.driver.init(this.caps))
      .then(() => {
        this.driver.setAsyncScriptTimeout(30000)
        return Promise.resolve();
      })
  })
  After(function() {
    if (this.config.after) {
      return this.config.after(this.caps)
        .then(() => this.driver.quit())
        .catch(e => {
          console.log(e);
          return this.driver.quit();
        })
    }
    return this.driver.quit();
  });
  const world = this;
  registerHandler('AfterFeatures', function(features, callback) {
    pushNewScreenshots()
      .then(callback)
      .catch(callback)
  });
});