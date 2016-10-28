import {mockComponent} from 'jest-react-native';


jest.doMock('requireNativeComponent', () => {
  const React = require('react');

  return viewName => props => React.createElement(
    viewName,
    props,
    props.children,
  );
});
// jest.mock('../src/components/natives/Map', () => {console.log(this); mockComponent('../src/components/natives/Map.js')});
