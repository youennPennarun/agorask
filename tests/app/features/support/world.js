const wd = require('wd');
const getConfig = require('./configs');
const {defineSupportCode} = require('cucumber');

const LoginPage = require('./pages/LoginView');


function CustomWorld() {
  const conf = getConfig('local');
  this.driver = wd.promiseChainRemote(conf.server.url || conf.server);
  this.LoginPage = new LoginPage(this.driver);
  this.caps = conf.caps;
  
}

defineSupportCode(function({setWorldConstructor, setDefaultTimeout}) {
  setDefaultTimeout(10 * 60 * 1000); // Huge timeout as get a phone with a free plan can take quite
  setWorldConstructor(CustomWorld);
})