const path = require('path');
const {startMockLocationService, stopMockLocationService} = require('./utils');

const testdroid = {
  caps: {
    testdroid_apiKey: process.env.TESTDROID_API_KEY,
    testdroid_target: 'android',
    testdroid_project: 'agorask',
    testdroid_testrun: 'test 3',
    testdroid_device: 'LG Google Nexus 5 6.0 -EU',
    testdroid_app: 'latest',
    platformName: 'Android',
    deviceName: 'Android Phone',
  },
  server: {url: 'http://appium.testdroid.com/wd/hub'},
};
const testobject = {
  caps: {
    testobject_api_key: process.env.TESTOBJECT_API_KEY,
    testobject_device: 'LG_Nexus_5X_real',
    testobject_app_id: process.env.APP_ID,
    testobject_appium_version: '1.5.3',
  },
  server: {url: 'http://appium.testobject.com/wd/hub'},
  screenshotsDirName: 'LG_Nexus_5X_real',
};

const saucelabs = {
  caps: {
    name: 'Sample Test',
    browserName: '',
    appiumVersion: '1.5.3',
    deviceName: 'Android Emulator',
    deviceOrientation: 'portrait',
    platformVersion: '5.1',
    platformName: 'Android',
    app: 'sauce-storage:agorask.apk',
  },
  server: {
    url: `https://${process.env.SAUCE_USERNAME}:${process.env.SAUCE_ACCESS_KEY}@ondemand.saucelabs.com:443/wd/hub`,
  },
};

const local = {
  caps: {
    platformName: 'Android',
    deviceName: '192.168.1.35:5555',
    platformVersion: '5.1',
    appPackage: 'com.agorask.debug',
    appActivity: 'com.agorask.MainActivity',
    noReset: true,
    fullReset: false,
    waitForAppScript: true,
    app: path.join(
      __dirname,
      '../../../../../mobile_app/android/app/build/outputs/apk/app-debug.apk'
    ),
  },
  server: {port: 4723},
};

const opo = {
  caps: {
    platformName: 'Android',
    deviceName: '192.168.0.12:5555',
    platformVersion: '7.1.1',
    appPackage: 'com.agorask.debug',
    appActivity: 'com.agorask.MainActivity',
    noReset: true,
    fullReset: false,
    waitForAppScript: true,
    app: path.join(
      __dirname,
      '../../../../../mobile_app/android/app/build/outputs/apk/app-debug.apk'
    ),
  },
  server: {port: 4723},
  before: (caps) => {
    return startMockLocationService(caps, {latitude: 52.527, longitude: 13.395})
  },
  after: stopMockLocationService,
  screenshotsDirName: 'local',
};


const circle = {
  caps: {
    platformName: 'Android',
    deviceName: '192.168.1.35:5555',
    platformVersion: '6.0',
    appPackage: 'com.agorask',
    appActivity: 'com.agorask.MainActivity',
    noReset: true,
    fullReset: false,
    waitForAppScript: true,
    app: path.join(
      __dirname,
      '../../../../../mobile_app/android/app/build/outputs/apk/app-release.apk'
    ),
  },
  server: {port: 4723},
};

module.exports = function getConfig(type) {
  switch (type.toUpperCase()) {
    case 'LOCAL':
      return local;
    case 'OPO':
      return opo;
    case 'CIRCLE':
      return circle;
    case 'TEST_DROID':
    case 'TESTDROID':
      return testdroid;
    case 'TEST_OBJECT':
    case 'TESTOBJECT':
      return testobject;
    case 'SAUCE_LABS':
    case 'SAUCELABS':
    case 'SAUCE_LAB':
    case 'SAUCELAB':
      return saucelabs;
    default:
      return local;
  }
};
