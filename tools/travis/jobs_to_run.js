const child_process = require('child_process');
const fs = require('fs');

const branch = process.env.TRAVIS_BRANCH;
const commit = process.env.TRAVIS_COMMIT;

if (!branch || !commit) process.exit();

const root = "../..";
const buildServerFileName = "TRAVIS_BUILD_SERVER";
const buildAppFileName = "TRAVIS_BUILD_APP";

fs.closeSync(fs.openSync(`${root}/${buildServerFileName}`, 'w'));
fs.closeSync(fs.openSync(`${root}/${buildAppFileName}`, 'w'));


const repo="youennPennarun/agorask";



function findLastBuild() {
  return new Promise((resolve, reject) => {
    child_process.exec(`curl -L https://api.travis-ci.org/${repo}/builds`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(error);
        return;
      }
      let builds = JSON.parse(stdout);
      const lastBuild = builds.find(build => build.branch === branch);
      if (lastBuild === -1) {
        return reject('not found');
      }
      return resolve(lastBuild);
    });
  })
}

function getLastBuildDataStatus(id) {
  return new Promise((resolve, reject) => {
    child_process.exec(`curl -L https://api.travis-ci.org/${repo}/builds/${id}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(error);
        return;
      }
      let build = JSON.parse(stdout);
      resolve(build)
    });
  })
}

function getCommit() {
  return new  Promise((resolve, reject) => {
    child_process.exec(`curl -L https://api.github.com/repos/youennPennarun/agorask/commits/${commit}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(error);
        return;
      }
      return resolve(JSON.parse(stdout))
    });
  });
}

function checkBuildsNeeded({commit, files}) {
  if (commit.message.match(/\[ *(ci +force_tests)|(force_tests +ci) ?\]/gi)) return;
  let serverHasChanged = false;
  let appHasChanged = false;
  console.log(files)
  for(let i = 0; i < files.length; i++) {
    if (files[i].filename.startsWith("server")) {
      serverHasChanged= true;
    } else if (files[i].filename.startsWith("mobile_app")) {
      appHasChanged = true;
    }

    if (serverHasChanged && appHasChanged) break;
  }
  console.log({serverHasChanged, appHasChanged})
  if (!serverHasChanged) {
    fs.unlinkSync(`${root}/${buildServerFileName}`);
  }
  if (!appHasChanged) {
    fs.unlinkSync(`${root}/${buildAppFileName}`);
  }
}


findLastBuild()
  .then(build => {
    console.log(build)
    if (build.result === null) {
      process.exit();
    }
    console.log("get com")
    return getCommit();
  })
  .then(commitData => checkBuildsNeeded(commitData))
  .catch(console.log);



