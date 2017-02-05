
jest.doMock('requireNativeComponent', () => {
  const React = require('react');

  return viewName => props => React.createElement(
    viewName,
    props,
    props.children,
  );
});
jest.mock('../src/utils/Location', () => {
  const mock = {};
  mock.getCurrentPositionCb = () => null;
  mock.watchPositionCb = () => null;
  mock.clearWatch = jest.fn();

  mock.getCurrentPosition = (cb) => { mock.getCurrentPositionCb = cb; };
  mock.watchPosition = (cb) => {
    mock.watchPositionCb = cb;
    return 1;
  };
  return mock;
});
