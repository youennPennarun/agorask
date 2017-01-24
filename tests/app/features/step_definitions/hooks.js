var {defineSupportCode} = require('cucumber');

defineSupportCode(function({Before, After}) {
  Before(function(scenarioResult, callback) {
    this.driver.init(this.caps).then(data => {
      this.driver.setAsyncScriptTimeout(30000);
      // this.driver.setGeoLocation(54.607868, -5.926437, 30);
      callback()
    }).catch((e) => {
      callback(e.data || e)
    });
  })
  After(function() {
    return this.driver.quit();
  });
});