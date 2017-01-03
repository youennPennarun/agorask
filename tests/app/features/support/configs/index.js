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
  server: {
    url: 'http://appium.testdroid.com/wd/hub',
  },
}
const testobject = {
  caps: {
    testobject_api_key: process.env.TESTOBJECT_API_KEY,
    testobject_device: 'Motorola_Moto_E_2nd_gen_free',
  },
  server: {
    url: "http://appium.testobject.com/wd/hub",
  }
}

const local = {
  caps: {
    platformName: "Android",
    deviceName: "192.168.1.35:5555",
    platformVersion: "7.1.1",
    appPackage: "com.agorask.debug",
    appActivity: "com.agorask.MainActivity",
    noReset: true,
    fullReset: false,
    waitForAppScript: true,
  },
  server: {
    port: 4723,
  },
}

module.exports = function getConfig(type) {
  switch (type.toUpperCase()) {
    case 'LOCAL':
      return local;
    case 'TEST_DROID':
    case 'TESTDROID':
      return testdroid;
    case 'TEST_OBJECT':
    case 'TESTOBJECT':
      return testobject;
    default:
      console.log('Unknown config type ' + type);
      return local;
  }
}