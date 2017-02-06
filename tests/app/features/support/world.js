const wd = require('wd');
const getConfig = require('./configs');
const {defineSupportCode} = require('cucumber');
const getScreenshotsDirectories = require('./utils/createScreenshotsDir');
const {getSnapshotsToUpdate} = require('./utils/updateSnaphots');


const LoginPage = require('./pages/LoginView');
const MapPage = require('./pages/MapView');

const confName = process.env.APPIUM_CONFIG_NAME || (process.env.CIRCLECI ? 'testobject' : 'opo');
console.log(`using config ${confName}`);

function CustomWorld({parameters}) {
  this.parameters = parameters;
  this.config = getConfig(confName);
  const {screenshotsDirName = 'last'} = this.config;
  this.parameters.screenshotsDirectories = getScreenshotsDirectories(screenshotsDirName);
  this.parameters.updateScreenshots = this.parameters.updateScreenshots || getSnapshotsToUpdate(screenshotsDirName);
  this.driver = wd.promiseChainRemote(this.config.server.url || this.config.server);
  const browser = this.driver;
  
  this.LoginPage = new LoginPage(this.driver);
  this.MapPage = new MapPage(this.driver);
  this.caps = this.config.caps;
}

defineSupportCode(function({setWorldConstructor, setDefaultTimeout}) {
  setDefaultTimeout(10 * 60 * 1000);
  // Huge timeout as get a phone with a free plan can take quite
  setWorldConstructor(CustomWorld);
});