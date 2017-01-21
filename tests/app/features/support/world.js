const wd = require('wd');
const getConfig = require('./configs');
const {defineSupportCode} = require('cucumber');

const LoginPage = require('./pages/LoginView');

const confName = process.env.CIRCLECI ? 'circle' : 'local';
console.log(`using config ${confName}`);

function CustomWorld() {
  const conf = getConfig(confName);
  this.driver = wd.promiseChainRemote(conf.server.url || conf.server);
  this.LoginPage = new LoginPage(this.driver);
  this.caps = conf.caps;
}

defineSupportCode(function({setWorldConstructor, setDefaultTimeout}) {
  setDefaultTimeout(10 * 60 * 1000);
  // Huge timeout as get a phone with a free plan can take quite
  setWorldConstructor(CustomWorld);
});