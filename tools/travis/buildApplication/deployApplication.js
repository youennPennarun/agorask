const exec = require('child-process-promise').exec;
const co = require('co');
const colors = require('colors');

const createEnvFile = require('./createEnvFile');
const buildNativeVersion = require('./buildNativeVersion');

const ANDROID_PATH = `${process.env.TRAVIS_BUILD_DIR}/mobile_app/android`;
const COMMIT_RANGE = process.env.TRAVIS_COMMIT_RANGE || 'HEAD 165c4f25d77c';


function getEnvOptions() {
  return {
    API_URL: process.env.MOBILE_APP_API_URL,
  };
}

function* nativeChanged() {
  const res = yield exec(`git diff --name-only ${COMMIT_RANGE}`)
  const files = res.stdout.split('\n');
  const nativeChanged = !!files.find(f => f.startsWith('mobile_app/android'));
  return nativeChanged;
}
const build = co(function* () {
  const nativeHasChanged = yield nativeChanged();
  if (nativeHasChanged) {
    console.log(`${'Native files have changed'.blue}: ${'Rebuilding app'.green}`)
  } else {
    console.log(`${'Native files havn\'t changed'.white}: ${'Releasing via codepush'.green}`)
  }
  const releaseDate = yield createEnvFile(getEnvOptions());
  yield buildNativeVersion(ANDROID_PATH, releaseDate);
})

build.then(console.log)
  .catch(console.log)
   