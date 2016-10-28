// @flow

import React from 'react';
import {
  AppRegistry,
} from 'react-native';

import App from './src/components/App';

export default function agorask(): Object {
  return <App />;
}


AppRegistry.registerComponent('agorask', (): string => agorask);
