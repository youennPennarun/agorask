const wd = require('wd');
const getConfig = require('./configs');
const {defineSupportCode} = require('cucumber');

const LoginPage = require('./pages/LoginView');
const MapPage = require('./pages/MapView');


const confName = process.env.APPIUM_CONFIG_NAME || (process.env.CIRCLECI ? 'testobject' : 'opo');
console.log(`using config ${confName}`);

function CustomWorld() {
  this.config = getConfig(confName);
  this.driver = wd.promiseChainRemote(this.config.server.url || this.config.server);
  this.LoginPage = new LoginPage(this.driver);
  this.MapPage = new MapPage(this.driver);
  this.caps = this.config.caps;
}

defineSupportCode(function({setWorldConstructor, setDefaultTimeout}) {
  setDefaultTimeout(10 * 60 * 1000);
  // Huge timeout as get a phone with a free plan can take quite
  setWorldConstructor(CustomWorld);
});