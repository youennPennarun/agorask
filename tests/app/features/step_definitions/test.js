var {defineSupportCode} = require('cucumber');
const {asserters} = require('wd');
const resemble = require('node-resemble-js');
const fs = require('fs');

const path = require('path');

const diffImagePath = "../../snapshots";

defineSupportCode(function({Given, When, Then}) {
  When(/I take a screenshot named "([^"]+)"/, function (fileName) {
    const fileFullName = path.join(__dirname, `../../snapshots/${fileName}.png`);
    const newFileFullName = path.join(__dirname, `../../snapshots/${fileName}_new.png`);
    const diffFileFullName = path.join(__dirname, `../../snapshots/${fileName}_diff.jpg`);
    if (!fs.existsSync(fileFullName)) {
      console.log('Snapshot desn\'t exists. Creating it and skipping comparison');
      return this.driver.saveScreenshot(fileFullName);
    }
    return new Promise((resolve, reject) => {
        this.driver.saveScreenshot(newFileFullName)
        .then(() => {
          resemble(fileFullName).compareTo(newFileFullName).onComplete(function(data){
            console.log(data);
            fs.open(diffFileFullName, 'w', function(err, fd) {
              if (err) return reject(err);
              fs.write(fd, data.getDiffImageAsJPEG(), 0, data.getDiffImageAsJPEG().length, null, function(err) {
                if (err) return reject(err);
                fs.close(fd, function() {
                  return resolve();
                })
              });
            });
          });
        });
    });
  });
  When("I hide the keyboard", function() {
    return this.driver.hideDeviceKeyboard();
  })
});