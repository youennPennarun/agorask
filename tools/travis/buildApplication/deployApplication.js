const exec = require('child-process-promise').exec;
const co = require('co');
const colors = require('colors');
const configs = require('./config');

const createEnvFile = require('./createEnvFile');
const buildNativeVersion = require('./buildNativeVersion');

const ANDROID_PATH = `${process.env.TRAVIS_BUILD_DIR}/mobile_app/android`;
const COMMIT_RANGE = process.env.TRAVIS_COMMIT_RANGE || 'HEAD 165c4f25d77c';


function getEnvOptions() {
  return {};
}

function* nativeChanged() {
  const res = yield exec(`git diff --name-only ${COMMIT_RANGE}`)
  const files = res.stdout.split('\n');
  const nativeChanged = !!files.find(f => f.startsWith('mobile_app/android'));
  return nativeChanged;
}
const build = co(function* () {
  console.log(`${colors.blue('Start releasing')}`);
  const nativeHasChanged = yield nativeChanged();
  if (nativeHasChanged) {
    console.log(`${'Native files have changed'.blue}: ${'Rebuilding app'.green}`)
  } else {
    console.log(`${'Native files havn\'t changed'.white}: ${'Releasing via codepush'.green}`)
  }
  const releaseDate = yield createEnvFile(getEnvOptions());
  yield buildNativeVersion(ANDROID_PATH, releaseDate);
})

const config = configs.branches[process.env.TRAVIS_BRANCH];
console.log(config)
if (!config) {
  console.log(`${colors.cyan('No build defined for branch')} ${process.env.TRAVIS_BRANCH} ${colors.blue('Skipping build')}`)
  process.exit();
}

build.then(console.log)
  .catch(console.log)
   