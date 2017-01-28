/* global jest, expect, describe, it, navigator */

import 'react-native';
import React from 'react';

import {SearchBar} from '../src/components/views/map/SearchBar';

import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

it('renders correctly when no query', () => {
  const wrapper = shallow(
    <SearchBar clearSearch={() => {}}
      updateSearchQuery={() => {}}
      search={() => {}}
      openDrawer={() => {}} />,
  );
  expect(shallowToJson(wrapper)).toMatchSnapshot();
});

it('renders correctly when is filled', () => {
  const wrapper = shallow(
    <SearchBar query='Some query'
      clearSearch={() => {}}
      updateSearchQuery={() => {}}
      search={() => {}}
      openDrawer={() => {}}  />,
  );
  expect(shallowToJson(wrapper)).toMatchSnapshot();
});

it('Clear query and open drawer', () => {
  const clearSearch = jest.fn();
  const openDrawer = jest.fn();
  const wrapper = shallow(
    <SearchBar query='Some query'
      search={() => {}}
      updateSearchQuery={() => {}}
      clearSearch={clearSearch}
      openDrawer={openDrawer} />,
  );
  wrapper.find('TouchableOpacity').at(1).simulate('press');
  expect(clearSearch.mock.calls.length).toBe(1);
  wrapper.setProps({query: ''});
  wrapper.find('TouchableOpacity').at(0).simulate('press');
  expect(openDrawer.mock.calls.length).toBe(1);
});
