let Logger;

if (__DEV__) {
  Logger = global.Reactotron;
} else {
  Logger = console;
}

module.exports = Logger;
