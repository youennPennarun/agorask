var {defineSupportCode} = require('cucumber');
const {asserters} = require('wd');
const resemble = require('node-resemble-js');
const fs = require('fs');

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
  When(/I take a screenshot named "([^"]+)"/, function (fileName) {
    const fileFullName = path.join(__dirname, `../../snapshots/${fileName}.png`);
    const newFileFullName = path.join(NEW_IMAGES_PATH, `${fileName}_new.png`);
    const diffFileFullName = path.join(NEW_IMAGES_PATH, `${fileName}_diff.jpg`);
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
            .scaleToSameSize()
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
  });
  When("I hide the keyboard", function() {
    return this.driver.hideDeviceKeyboard();
  })
});