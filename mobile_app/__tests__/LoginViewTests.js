/* global jest, expect, describe, it */

import 'react-native';
import React from 'react';

import {LoginView} from '../src/components/views/login/LoginView';

import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';


it('renders correctly', () => {
  const wrapper = shallow(
    <LoginView />
  );
  expect(shallowToJson(wrapper)).toMatchSnapshot();
});
