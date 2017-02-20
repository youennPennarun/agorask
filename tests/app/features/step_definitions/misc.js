var {defineSupportCode} = require('cucumber');
const {asserters} = require('wd');
const fs = require('fs');

const PixelDiff = require('pixel-diff');
const path = require('path');

const NEW_IMAGES_PATH = `${(process.env.CIRCLE_ARTIFACTS || '/tmp/agorask_build')}/screenshots`;

const cropOpts = {
  y: 75,
};
function createPixelDiff(imageAPath, imageBPath, diffFileFullName) {
  return new PixelDiff({
    imageAPath,
    imageBPath,
    cropImageA: cropOpts,
    cropImageB: cropOpts,

    thresholdType: PixelDiff.THRESHOLD_PERCENT,
    threshold: 0.02, // 1% threshold

    imageOutputPath: diffFileFullName
  });
}

function shouldUpdateScreenshot(fileName, updateScreenshots) {
  if (!updateScreenshots) return false;
  if (typeof updateScreenshots === 'string' && updateScreenshots.toLocaleLowerCase === 'all') {
    return true;
  }
  if (updateScreenshots instanceof Array && updateScreenshots.includes(fileName)) {
    return true;
  }
  return false;
}

function takeScreenshot(fileName) {
  const {updateScreenshots, screenshotsDirectories: {initial, newImages}} = this.parameters;
  const imageAPath = path.join(initial, `${fileName}.png`);
  const imageBPath = path.join(newImages, `${fileName}_new.png`);
  const diffFileFullName = path.join(newImages, `${fileName}_diff.png`);
  const diff = createPixelDiff(imageAPath, imageBPath, diffFileFullName);
  if (!fs.existsSync(imageAPath)) {
    console.log(`${imageAPath} doesn't exists, creating it`)
    return this.driver.saveScreenshot(imageAPath)
  }
  if (shouldUpdateScreenshot(fileName, updateScreenshots)) {
    console.log(`Updating ${fileName}`)
    return this.driver.saveScreenshot(imageAPath) 
  }
  return this.driver.saveScreenshot(imageBPath)
    .then(() => diff.runWithPromise())
    .then((result) => {
      if (diff.hasPassed(result.code)) {
        return Promise.resolve();
      }
      console.log(result);
      return Promise.reject(`Found ${result.differences} differences`);
    });
}

defineSupportCode(function({Given, When, Then}) {
  When(/^I take a screenshot named "([^"]+)"$/, function (fileName) {
    return takeScreenshot.bind(this)(fileName);
  });
  When(/^I take a screenshot named "([^"]+)" after ([0-9]+) ?ms$/, function (fileName, delay) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        takeScreenshot.bind(this)(fileName)
          .then(resolve).catch(reject);
      }, delay);
    })
  });

  When("I hide the keyboard", function() {
    return this.driver.hideDeviceKeyboard();
  })
});