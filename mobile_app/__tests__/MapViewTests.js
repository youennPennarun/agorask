/* global jest, expect, describe, it, navigator */

import 'react-native';
import React from 'react';

import {MapView} from '../src/components/views/map/MapView';

import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import Location from '../src/utils/Location';


it('renders correctly without any venues', () => {
  const wrapper = shallow(
    <MapView />,
  );
  expect(shallowToJson(wrapper)).toMatchSnapshot();
});

it('renders correctly with venues', () => {
  const wrapper = shallow(
    <MapView venues={[{
      _id: 'venueId1',
      name: 'venue test 1',
      address: {
        location: [50, -5],
      },
      nbTasks: 2,
    }, {
      _id: 'venueId2',
      name: 'venue test 2',
      address: {
        location: [51, -6],
      },
      nbTasks: 10,
    }, {
      _id: 'venueId3',
      name: 'venue test 3',
      address: {
        location: [52, -7],
      },
      nbTasks: 20,
    }]} />,
  );
  expect(shallowToJson(wrapper)).toMatchSnapshot();
});

it('renders correctly with search results', () => {
  const wrapper = shallow(
    <MapView searchResults={[{
      foursquareId: 'foursquareVenueId1',
      source: 'foursquare',
      name: 'venue test 1',
      address: {
        location: [50, -5],
      },
      nbTasks: 2,
    }, {
      foursquareId: 'foursquareVenueId2',
      source: 'foursquare',
      name: 'venue test 2',
      address: {
        location: [51, -6],
      },
      nbTasks: 10,
    }, {
      foursquareId: 'foursquareVenueId3',
      source: 'foursquare',
      name: 'venue test 3',
      address: {
        location: [52, -7],
      },
      nbTasks: 20,
    }]} />,
  );
  expect(shallowToJson(wrapper)).toMatchSnapshot();
});

it('update user position called and clearWatch on componentWillUnmount', () => {
  const updateUserLocation = jest.fn();
  const wrapper = shallow(
    <MapView updateUserLocation={updateUserLocation} />,
    { lifecycleExperimental: true },
  );
  Location.getCurrentPositionCb({ coords: {latitude: 50, longitude: -5}});
  expect(updateUserLocation.mock.calls.length).toBe(1);
  Location.watchPositionCb({ coords: {latitude: 50, longitude: -5}});
  expect(updateUserLocation.mock.calls.length).toBe(2);
  wrapper.unmount();
  expect(Location.clearWatch.mock.calls.length).toBe(1);
});
