var {defineSupportCode} = require('cucumber');
const {asserters} = require('wd');
const fs = require('fs');

const PixelDiff = require('pixel-diff');

const path = require('path');

const NEW_IMAGES_PATH = `${(process.env.CIRCLE_ARTIFACTS || '/tmp/agorask_build')}/screenshots`;
NEW_IMAGES_PATH.split('/').reduce((previousPath, currentDirectory) => {
  const cPath = `${previousPath}/${currentDirectory}`;
  if (!fs.existsSync(cPath)) {
    fs.mkdirSync(cPath)
  }
  return cPath;
});

defineSupportCode(function({Given, When, Then}) {
  /*
  When(/I take a screenshot named "([^"]+)"/, function (fileName) {
    if (!fs.existsSync(fileFullName)) {
      console.log('Snapshot desn\'t exists. Creating it and skipping comparison');
      return this.driver.saveScreenshot(fileFullName);
    }
    return new Promise((resolve, reject) => {
        this.driver.saveScreenshot(newFileFullName)
        .then(() => {
          resemble(fileFullName)
            .compareTo(newFileFullName)
            .ignoreRectangles([[0,0,10000, 75]])
            .ignoreAntialiasing()
            .onComplete(function(data){
              console.log(data);
              fs.writeFile(diffFileFullName, data.getDiffImageAsJPEG(), function(err) {
                if (err) return reject(err);
                return resolve();
              });
          });
        }).catch(reject);
    });
  });*/
  When(/I take a screenshot named "([^"]+)"/, function (fileName) {
    const imageAPath = path.join(__dirname, `../../snapshots/${fileName}.png`);
    const imageBPath = path.join(NEW_IMAGES_PATH, `${fileName}_new.png`);
    const diffFileFullName = path.join(NEW_IMAGES_PATH, `${fileName}_diff.png`);

    const cropOpts = {
      y: 75,
    };

    const diff = new PixelDiff({
      imageAPath,
      imageBPath,
      cropImageA: cropOpts,
      cropImageB: cropOpts,

      thresholdType: PixelDiff.THRESHOLD_PERCENT,
      threshold: 0.02, // 1% threshold

      imageOutputPath: diffFileFullName
    });
    if (!fs.existsSync(imageAPath)) {
      return this.driver.saveScreenshot(imageAPath)
    }
    return this.driver.saveScreenshot(imageBPath)
      .then(() => {
        return diff.runWithPromise();
      })
      .then((result) => {
        if (diff.hasPassed(result.code)) {
          return Promise.resolve();
        }
        console.log(result);
        return Promise.reject(`Found ${result.differences} differences`);
      });
  });

  When("I hide the keyboard", function() {
    return this.driver.hideDeviceKeyboard();
  })
});