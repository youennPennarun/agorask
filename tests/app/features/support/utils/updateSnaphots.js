const execSync = require('child_process').execSync;
const spawn = require('child_process').spawn;
const path = require('path');

function spawnPromiseFactory(onDataStdout, onDataStdErr) {
  onDataStdout = onDataStdout || (() => {});
  onDataStdErr = onDataStdErr || onDataStdout;
  return (...args) => {
    return new Promise((resolve, reject) => {
      const child = spawn(...args);
      child.stdout.on('data', onDataStdout);
      child.stderr.on('data', onDataStdErr);
      child.on('close', code => {
        if (code === 0) {
          return resolve();
        } else {
          return reject(code);
        }
      })
    })
  }
}

function pushNewScreenshots() {
  const spawnPromise = spawnPromiseFactory(buffer => { console.log(buffer.toString()); });
  const directory = path.join(__dirname, '../../../screenshots/')
  if (!process.env.CIRCLE_BRANCH) return Promise.resolve();
  console.log(directory)
  return spawnPromise('git', ['add', directory])
    .then(() => spawnPromise('git', ['commit', '-m', '"[auto pushed by CI] Update screenshots[skip ci]"']))
    .then(() => spawnPromise('git', ['push', 'origin', process.env.CIRCLE_BRANCH]));
}

function screenshotsToUpdateFromLocalTests(directory) {
  if (process.env.CIRCLECI && process.env.COMMIT_RANGE) {
    const res = execSync(`git diff --name-only ${process.env.COMMIT_RANGE}`).toString();
    const files = res.split('\n');
    return files.filter(f => f.startsWith(`tests/app/screenshots/local`));
  }
  return [];
}


function screenshotsToUpdateFromCommitDesc() {
  if (process.env.CIRCLECI && process.env.GIT_COMMIT_DESC) {
    const re = /\[ *ci +updateScreenshots +(.*) *\]/;
    const matches = process.env.GIT_COMMIT_DESC.match(re);
    if (matches && matches.length === 2) {
      return matches[1].split(',');
    }
    return [];
  }
  return [];
}

function getSnapshotsToUpdate(directory) {
  return screenshotsToUpdateFromLocalTests(directory).concat(screenshotsToUpdateFromCommitDesc());
}

module.exports = {
  getSnapshotsToUpdate,
  pushNewScreenshots,
}
