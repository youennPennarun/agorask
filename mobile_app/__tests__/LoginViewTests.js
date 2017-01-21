/* global jest, expect, describe, it */

import 'react-native';
import React from 'react';

import {LoginView} from '../src/components/views/login/LoginView';

import {shallow} from 'enzyme';
import {shallowToJson} from 'enzyme-to-json';

it('renders correctly', () => {
  const wrapper = shallow(<LoginView />);
  expect(shallowToJson(wrapper)).toMatchSnapshot();
});

it('Button disabled if username is not filled', () => {
  const doLogin = jest.fn();
  const wrapper = shallow(<LoginView doLogin={doLogin} />);
  wrapper.setState({username: '', password: 'Look at me'});
  wrapper.find('BuiltButton').at(0).simulate('press');
  expect(doLogin.mock.calls.length).toBe(0);
});

it('Button disabled if password is not filled', () => {
  const doLogin = jest.fn();
  const wrapper = shallow(<LoginView doLogin={doLogin} />);
  wrapper.setState({username: 'mrMeeseeks', password: ''});
  wrapper.find('BuiltButton').at(0).simulate('press');
  expect(doLogin.mock.calls.length).toBe(0);
});

it('Button enabled if username and password are filled', () => {
  const doLogin = jest.fn();
  const wrapper = shallow(<LoginView doLogin={doLogin} />);
  wrapper.setState({username: 'mrMeeseeks', password: 'Look at me'});
  wrapper.find('BuiltButton').at(0).simulate('press');
  expect(doLogin.mock.calls.length).toBe(1);
  expect(shallowToJson(wrapper)).toMatchSnapshot();
});

it(
  'Should NOT login when submitting the password if the password is not filled',
  () => {
    const doLogin = jest.fn();
    const wrapper = shallow(<LoginView doLogin={doLogin} />);
    wrapper.setState({username: 'mrMeeseeks', password: ''});
    wrapper.find('BuiltTextfield').at(1).props().onSubmitEditing();
    expect(doLogin.mock.calls.length).toBe(0);
  },
);
it(
  'Should login when submitting the password if username and password are filled',
  () => {
    const doLogin = jest.fn();
    const wrapper = shallow(<LoginView doLogin={doLogin} />);
    wrapper.setState({username: 'mrMeeseeks', password: 'Look at me'});
    wrapper.find('BuiltTextfield').at(1).props().onSubmitEditing();
    expect(doLogin.mock.calls.length).toBe(1);
  },
);

it('Should go back on receiving token', () => {
  const back = jest.fn();
  const props = {navigator: {back}};
  const wrapper = shallow(<LoginView {...props} />);
  wrapper.setProps({...props, token: 'token'});
  expect(back.mock.calls.length).toBe(1);
});

it('Should go back owhen clicking on \'Skip login\'', () => {
  const back = jest.fn();
  const props = {navigator: {back}};
  const wrapper = shallow(<LoginView {...props} />);
  wrapper.find('TouchableOpacity').at(0).simulate('press');
  expect(back.mock.calls.length).toBe(1);
});