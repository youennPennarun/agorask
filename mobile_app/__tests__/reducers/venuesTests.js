/* global jest, expect, describe, it */

import 'react-native';
import React from 'react'; // eslint-ignore-line

import VenueReducers, {venuesDefaultState} from '../../src/redux/reducers/venue';
import {FETCHING_LIST, SUCCESS_LIST, FAILURE_LIST} from '../../src/redux/actions/venue';

it('default venues state', () => {
  const newState = VenueReducers.venues(undefined, {});
  expect(newState).toMatchSnapshot();
});

it('fetching venues', () => {
  const newState = VenueReducers.venues(venuesDefaultState, {
    type: FETCHING_LIST,
  });
  expect(newState).toMatchSnapshot();
});

it('fetch venues successful', () => {
  const newState = VenueReducers.venues(venuesDefaultState, {
    type: SUCCESS_LIST,
    venues: [{_id: 'id', name: 'venueTest'}],
  });
  expect(newState).toMatchSnapshot();
});
it('fetch venues fail', () => {
  const error = new Error('Unable to fetch venues');
  const newState = VenueReducers.venues(venuesDefaultState, {
    type: FAILURE_LIST,
    error,
  });
  expect(newState).toMatchSnapshot();
});


