/* global jest, expect, describe, it */

import 'react-native';
import React from 'react'; // eslint-ignore-line

import VenueReducers, {venuesDefaultState} from '../../src/redux/reducers/venue';
import {SUCCESS_LIST} from '../../src/redux/actions/venue';

it('renders correctly', () => {
  const newState = VenueReducers.venues(venuesDefaultState, {
    type: SUCCESS_LIST,
    venues: [{_id: 'id', name: 'venueTest'}],
  });
  expect(newState).toMatchSnapshot();
});
