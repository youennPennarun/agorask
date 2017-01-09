/* global jest, expect, describe, it */

import 'react-native';
import React from 'react';

import {AddAnswer} from '../src/components/views/taskDetails/AddAnswer';

import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

it('renders correctly', () => {
  const wrapper = shallow(
    <AddAnswer />
  );
  expect(shallowToJson(wrapper)).toMatchSnapshot();
});
