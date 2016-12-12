import 'react-native';
import React from 'react';
import Index from '../index.ios.js';

import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

it('renders correctly', () => {
  const wrapper = shallow(
    <Index />
  )
  expect(shallowToJson(wrapper)).toMatchSnapshot();
});
