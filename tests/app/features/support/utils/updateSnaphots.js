const execSync = require('child_process').execSync;
const spawn = require('child_process').spawn;
const path = require('path');

let COMMIT_RANGE;
if (process.env.CIRCLECI && process.env.CIRCLE_COMPARE_URL) {
  const re = /compare\/([0-9a-z]+)\.\.\.([0-9a-z]+)$/;
  const matches = process.env.CIRCLE_COMPARE_URL.match(re);
  if (matches.length === 3) {
    COMMIT_RANGE = `${matches[1]}...${matches[2]}`;
  }
}

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
  return spawnPromise('git', ['add', directory])
    .then(() => spawnPromise('git', ['commit', '-m', '[auto pushed by CI] Update screenshots[skip ci]']))
    .then(() => spawnPromise('git', ['push', 'origin', process.env.CIRCLE_BRANCH]));
}

function screenshotsToUpdateFromLocalTests(directory) {
  if (COMMIT_RANGE) {
    const res = execSync(`git diff --name-only ${COMMIT_RANGE}`).toString();
    const files = res.split('\n');
    console.log('Updated files: ', files)
    const updated = files.filter(f => f.startsWith(`tests/app/screenshots/local`));
    console.log('Updated screenshots: ', updated)
  }
  return [];
}


function screenshotsToUpdateFromCommitDesc() {
  if (process.env.CIRCLECI) {
    const GIT_COMMIT_DESC = execSync(`git log --format=oneline -n 1 ${process.env.CIRCLE_SHA1}`).toString()
    console.log('commit message: ', GIT_COMMIT_DESC)
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
