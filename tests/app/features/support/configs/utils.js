var exec = require('child_process').exec;

  const service = 'com.agorask.map.location.MockLocationService';

function startMockLocationService(caps, {latitude, longitude}) {
  return new Promise((resolve, reject) => {
    const extras = `-e latitude ${latitude} -e longitude ${longitude}`;
    const cmd = `adb shell am startservice ${extras} ${caps.appPackage}/${service}`;
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        return reject(error)
      }
      console.log(stdout);
      return resolve();
    });
  });
}
function stopMockLocationService(caps) {
  return new Promise((resolve, reject) => {
    const cmd = `adb shell am stopservice ${caps.appPackage}/${service}`;
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        return reject(error)
      }
      console.log(stdout);
      return resolve();
    });
  });
}

module.exports = {
  startMockLocationService,
  stopMockLocationService,
};
