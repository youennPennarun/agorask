/* global jest, expect, describe, it, navigator */

import 'react-native';
import React from 'react';

import {MapView} from '../src/components/views/map/MapView';

import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

function geoMock() {
  const mock = {};
  mock.getCurrentPositionCb = () => null;
  mock.watchPositionCb = () => null;
  mock.clearWatch = jest.fn();

  mock.geolocation = {
    getCurrentPosition: (cb) => { mock.getCurrentPositionCb = cb; },
    watchPosition: (cb) => {
      mock.watchPositionCb = cb;
      return 1;
    },
    clearWatch: mock.clearWatch,
  };
  return mock;
}

it('renders correctly without any venues', () => {
  navigator.geolocation = geoMock().geolocation;
  const wrapper = shallow(
    <MapView />,
  );
  expect(shallowToJson(wrapper)).toMatchSnapshot();
});

it('renders correctly with venues', () => {
  navigator.geolocation = geoMock().geolocation;
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
  navigator.geolocation = geoMock().geolocation;
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
  const mock = geoMock();
  navigator.geolocation = mock.geolocation;
  const updateUserLocation = jest.fn();
  const wrapper = shallow(
    <MapView updateUserLocation={updateUserLocation} />,
    { lifecycleExperimental: true },
  );
  mock.getCurrentPositionCb({ coords: {latitude: 50, longitude: -5}});
  expect(updateUserLocation.mock.calls.length).toBe(1);
  mock.watchPositionCb({ coords: {latitude: 50, longitude: -5}});
  expect(updateUserLocation.mock.calls.length).toBe(2);
  wrapper.unmount();
  expect(mock.clearWatch.mock.calls.length).toBe(1);
});
