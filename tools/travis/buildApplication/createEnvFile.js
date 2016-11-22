const fs = require('fs');
const SOURCES_PATH = `${process.env.TRAVIS_BUILD_DIR}/mobile_app`;

const ENV_FILE = `${SOURCES_PATH}/.env`;

function getNewEnvFile(data = "", options = {}) {
  console.log(`Reading env file in ${ENV_FILE}`);
  const newContent = data.split('\n')
    .map(line => {
      const [key, value] = line.split('=');
      if (!key) return null;
      if (key in options) {
        const nl = `${key}=${options[key]}`;
        delete options[key];
        return nl;
      }
      return `${key}=${value}`;
    })
    .filter(line => (line !== null));
  Object.keys(options)
    .map(key => newContent.push(`${key}=${options[key]}`));
  return newContent.join('\n') + '\n';
}

function readFile(options={}) {
  return new Promise((resolve, reject) => {
    fs.readFile(ENV_FILE, (err, data) => {
      if (err && err.code !== 'ENOENT') return reject(err);
      if (!data) data = "";
      resolve(getNewEnvFile(data.toString(), options));
    });
  });
}

function writeNewFile(data) {
  console.log(`Writing new env file in ${ENV_FILE}`);
  return new Promise((resolve, reject) => {
    fs.writeFile(ENV_FILE, data, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}


module.exports = function createEnvFile(options={}) {
  return new Promise((resolve, reject) => {
    let RELEASE_DATE = Date.now();
    if (!options.RELEASE_DATE) {
      options.RELEASE_DATE = RELEASE_DATE;
    } else {
      RELEASE_DATE = options.RELEASE_DATE;
    }
    readFile(options)
      .then(newData => writeNewFile(newData))
      .then(() => {resolve(RELEASE_DATE); })
      .catch(console.log);
  });
}