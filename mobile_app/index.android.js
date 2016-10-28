// @flow

import React from 'react';
import {
  AppRegistry,
} from 'react-native';

import App from './src/components/App';

export default function crowdThingy(): Object {
  return <App />;
}


AppRegistry.registerComponent('crowdThingy', (): string => crowdThingy);
