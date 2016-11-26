/* global jest, expect, describe, it */

import 'react-native';
import React from 'react';

import VenueDescription from '../src/components/views/venueDetails/VenueDescription';

import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

const venueTest1 = {
  name: 'Test venue',
  address: {
    formatted: [
      '2 univ street',
      '5200 Belfast',
      'UK',
    ],
  },
  categories: [],
  contact: {
    formattedPhone: '(060) 25-65',
  },
};

const venueTest2 = {
  name: 'Test venue',
  address: {
    formatted: '2 univ street 5200 Belfast UK',
  },
  categories: [],
  contact: {
    formattedPhone: '(060) 25-65',
  },
};

const venueTest3 = {
  name: 'Test venue',
  address: {
  },
  categories: [],
  contact: {
    formattedPhone: '(060) 25-65',
  },
};

it('Test with formatted address', () => {
  const wrapper = shallow(
    <VenueDescription venue={venueTest1} />
  );
  expect(shallowToJson(wrapper)).toMatchSnapshot();
});

it('Test with address as a single string', () => {
  const wrapper = shallow(
    <VenueDescription venue={venueTest2} />
  );
  expect(shallowToJson(wrapper)).toMatchSnapshot();
});


it('Test without address', () => {
  const wrapper = shallow(
    <VenueDescription venue={venueTest3} />
  );
  expect(shallowToJson(wrapper)).toMatchSnapshot();
});


