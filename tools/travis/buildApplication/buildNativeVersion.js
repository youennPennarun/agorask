const fetch = require('node-fetch');
const FormData = require('form-data');
const spawn = require('child-process-promise').spawn;
const co = require('co');
const fs = require('fs');
const colors = require('colors');

const token = process.env.ADMIN_TOKEN;

function* getVersion(ANDROID_PATH, buildType) {
  const reGetVersion = /android {[\s\S]*defaultConfig {[\s\S]*versionName "(.*)"/;
  const reGetSuffix = new RegExp(`buildTypes {[\\s\\S]*${buildType} {[\\s\\S]*versionNameSuffix "(.*)"`)
  const gradleConfig = fs.readFileSync(`${ANDROID_PATH}/app/build.gradle`).toString();
  const versionMatched = gradleConfig.match(reGetVersion);
  const suffixMatched = gradleConfig.match(reGetSuffix);
  const versionName = (versionMatched) ? versionMatched[1] : '0.0.0';
  const suffix = (suffixMatched) ? suffixMatched[1] : '';
  return `${versionName}${suffix}`
}

function* uploadRelease(ANDROID_PATH, releaseDate) {
  const version = yield getVersion(ANDROID_PATH, 'release');
  var form = new FormData();
  console.log(`Uploading version ${version}...`.green)
  form.append('app', fs.createReadStream(`${ANDROID_PATH}/app/build/outputs/apk/app-release.apk`));
  try {
    const response = yield fetch(`${process.env.SERVER_URL}/application/${releaseDate}?version=${version}&token=${token}`, { method: 'POST', body: form });
    if (response.status === 200) {
      console.log('Application successfully uploaded'.green);
    } else {
      console.log('Error on uploading application'.red);
      const txt = yield response.text();
      throw new Error(txt);
    }
  } catch (e) {
    console.log(e);
  }
}

function buildRelease(ANDROID_PATH, releaseDate) {
  return new Promise((resolve, reject) => {
    const options = {
      cwd: `${ANDROID_PATH}`,
    }
    const p = spawn('./gradlew', ['assembleDebug'], options);
    p.childProcess.stdout.on('data', (data) => {
      console.log(data.toString())
    });
    p.childProcess.stderr.on('data', (data) => {
      console.log(data.toString())
    });
    p.then(() => {
      co(uploadRelease(ANDROID_PATH)).then(resolve).catch(reject);
    }).catch(e => {
      console.log('error', e);
      reject();
    });
  });
}

module.exports = buildRelease;