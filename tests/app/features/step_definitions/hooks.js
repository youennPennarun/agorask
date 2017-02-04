var {defineSupportCode} = require('cucumber');


defineSupportCode(function({Before, After}) {
  

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
});