/* global jest, expect, describe, it */

import 'react-native';
import React from 'react';

jest.unmock('../src/components/views/login/LoginView');
import {LoginView} from '../src/components/views/login/LoginView';

import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';


it('renders correctly', () => {
  const wrapper = shallow(
    <LoginView />
  );
  expect(shallowToJson(wrapper)).toMatchSnapshot();
});

it('Cannot press on login button if no username/password have been set', () => {
  const wrapper = shallow(
    <LoginView params={{repo: ''}} />
  );
  const forksButton = rendered.refs.forks;
  expect(rendered.state.mode).toEqual('forks');
});