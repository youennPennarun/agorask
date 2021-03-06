const fetch = require('node-fetch');
const FormData = require('form-data');
const spawn = require('child-process-promise').spawn;
const co = require('co');
const fs = require('fs');
const colors = require('colors');

const args = require('./cmdArgs');

const configs = require('./config.js');
const config = configs.branches[args['branch']];

const token = process.env.ADMIN_TOKEN;

function* getVersion(ANDROID_PATH, buildType) {
  console.log(`${colors.blue('getting current version')}`);
  const reGetVersion = /android {[\s\S]*defaultConfig {[\s\S]*versionName "(.*)"/;
  const reGetSuffix = new RegExp(
    `buildTypes {[\\s\\S]*${buildType} {[^}]*versionNameSuffix "(.*)"[^}]*}`
  );
  const gradleConfig = fs
    .readFileSync(`${ANDROID_PATH}/app/build.gradle`)
    .toString();
  const versionMatched = gradleConfig.match(reGetVersion);
  const suffixMatched = gradleConfig.match(reGetSuffix);
  const versionName = versionMatched ? versionMatched[1] : '0.0.0';
  const suffix = suffixMatched ? suffixMatched[1] : '';
  console.log(
    `${colors.white('Got version')} ${colors.green(`${versionName}${suffix}`)}`
  );
  return `${versionName}${suffix}`;
}

function* uploadRelease(ANDROID_PATH, releaseDate) {
  const version = yield getVersion(ANDROID_PATH, config.buildType);
  const url = `${configs.deployTo}/application/${releaseDate}?version=${version}&type=${config.buildType}`;
  console.log(`Uploading version ${version} on ${url}...`.green);
  const form = new FormData();
  form.append(
    'app',
    fs.createReadStream(`${ANDROID_PATH}/app/build/outputs/apk/${config.out}`)
  );
  try {
    const response = yield fetch(`${url}&token=${token}`, {
      method: 'POST',
      body: form,
    });
    if (response.status === 200) {
      console.log('Application successfully uploaded'.green);
    } else {
      console.log('Error on uploading application'.red);
      const txt = yield response.text();
      throw new Error(txt);
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
}

function buildRelease(ANDROID_PATH, releaseDate) {
  return new Promise((resolve, reject) => {
    const env = Object.assign({}, process.env, {ENVFILE: config.envFile});
    const args = [config.gradleCommand, '--stacktrace', '--info'];
    const options = {cwd: `${ANDROID_PATH}`, env: env};
    console.log(`Running ./gradlew ${args.join(' ')}`);
    const p = spawn('./gradlew', args, options);
    p.childProcess.stdout.on('data', data => {
      process.stdout.write(data.toString());
    });
    p.childProcess.stderr.on('data', data => {
      process.stdout.write(data.toString());
    });
    p
      .then(() => {
        co(uploadRelease(ANDROID_PATH, releaseDate))
          .then(resolve)
          .catch(reject);
      })
      .catch(e => {
        console.log('error', e);
        reject();
      });
  });
}

module.exports = buildRelease;
