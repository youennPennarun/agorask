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


it('Button enable if usrname and password are filled', () => {
  const wrapper = shallow(
    <LoginView />
  );
  wrapper.setState({username: 'mrMeeseeks', password: 'Look at me'});
  expect(shallowToJson(wrapper)).toMatchSnapshot();
});