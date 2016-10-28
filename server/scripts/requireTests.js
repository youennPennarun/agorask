const path = require('path');

module.exports = function(tests=null, testsDirectory = null) {
  let testsToRun = null;
  let testParamIndex = process.argv.findIndex(value => value === '--tests');
  if (testParamIndex > 0 && process.argv[testParamIndex + 1]) {
    testParamIndex++;
    testsToRun = process.argv[testParamIndex]
      .split(',')
      .map(name => tests.find(test => test.name == name))
      .filter(value => (!!value));
  } else {
    testsToRun = tests;
  }
  testsToRun.map(({file}) => {
    require(path.join(testsDirectory, file))
  });
}