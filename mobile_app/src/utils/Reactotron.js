if (__DEV__) {
  const Reactotron = require('reactotron-react-native').default;
  const reactotronRedux = require('reactotron-redux').reactotronRedux;
  Reactotron
    .configure({
      name: 'Agorask',
    host: '192.168.0.19',
  }) // we can use plugins here -- more on this later
    .use(reactotronRedux())
    .connect();

  global.Reactotron = Reactotron;
}
