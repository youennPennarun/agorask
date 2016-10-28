/* @flow */
import React from 'react';
import { View, StyleSheet } from 'react-native';

import SearchBar from './SearchBar';

import Map from '../../natives/Map';
import MapMarker from '../../natives/MapMarker';

function MapView(props: Object): Object {
  return (
    <View style={{flex: 1}}>
      <Map style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'red',
      }} >
        <MapMarker coordinate={{
          latitude: 54.597285,
          longitude: -5.930120,
        }} />
      </Map>
      <SearchBar openDrawer={props.openDrawer} />
    </View>
  );
}

MapView.propTypes = {

};

export default MapView;
