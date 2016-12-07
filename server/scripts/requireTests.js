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
    if (!testsToRun.length) {
      console.log();
      console.log('Unknown tests', process.argv[testParamIndex]);
      console.error("Available tests: " + tests.map(test => test.name).join(', '));
      process.exit(1);
    }
  } else {
    console.log('Run all tests')
    testsToRun = tests;
  }
  testsToRun.map(({file}) => {
    require(path.join(testsDirectory, file))
  });
}