var {defineSupportCode} = require('cucumber');

defineSupportCode(function({Before, After}) {
  Before(function(scenarioResult, callback) {
    this.driver.init(this.caps).then(data => {
      this.driver.setAsyncScriptTimeout(30000);
      console.log("setGeo ")
      this.driver.setGeoLocation(5, -5, 30)
        .then(() => {
          callback();
        })
        .catch(e => {
          console.log('ERROR ', e);
          callback();
        });
      
    }).catch((e) => {
      callback(e.data || e)
    });
  })
  After(function() {
    return this.driver.quit();
  });
});