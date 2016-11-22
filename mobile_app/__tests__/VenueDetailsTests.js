/* global jest, expect, describe, it */

import 'react-native';
import React from 'react';

import {VenueDetails} from '../src/components/views/venueDetails/VenueDetails';

import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

const venueTest = {
  _id: '5834b73cb5cb2c65d95f7cea',
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

it('renders correctly', () => {
  const wrapper = shallow(
    <VenueDetails sourceId='00000'
      source='source'
      getVenueDetails={() => { console.log('getVenueDetails'); }}
      venue={venueTest} />
  );
  expect(shallowToJson(wrapper)).toMatchSnapshot();
});
