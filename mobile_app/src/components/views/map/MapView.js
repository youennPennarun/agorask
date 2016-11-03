/* @flow */
/* global navigator, alert */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import SearchBar from './SearchBar';

import Map from '../../natives/Map';
import MapMarker from '../../natives/MapMarker';
import {getVenuesWithTasksNearPosition} from '../../../redux/actions/venue';
import {pushRoute} from '../../../redux/actions/router';

export class MapView extends React.Component {
  state = {
    position: null,
  };
  watchID = null;

  componentDidMount() {
    navigator.geolocation.getCurrentPosition((position) => {
        this._onGetPosition(position);
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition(position => { this._onGetPosition(position); });
  }
  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  _onGetPosition = (position) => {
    this.props.getVenuesWithTasks(position.coords);
  }
  _renderMarkers(venues) {
    console.log(venues);
    return venues.map((venue, key) => (
      <MapMarker key={key}
        coordinate={{
          latitude: venue.address.location[1],
          longitude: venue.address.location[0],
        }}
        onPress={() => {
          console.log('Pressed on ', venue.name);
          this.props.goToVenueDetails(key);
        }} />
    ));
  }
  render() {
    const {venues} = this.props;
    return (
      <View style={{flex: 1}}>
        <Map style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'red',
        }} >
          {this._renderMarkers(venues)}
        </Map>
        <SearchBar openDrawer={this.props.openDrawer} />
      </View>
    );
  }
}

MapView.propTypes = {

};
const mapStateToProps = state => ({
  venues: state.venues.venues,
});
const mapDispatchToProps = (dispatch) => ({
  goToVenueDetails: (selectedVenueIndex) => { dispatch(pushRoute({key: 'venueDetails', selectedVenueIndex})); },
  getVenuesWithTasks: (coords) => { dispatch(getVenuesWithTasksNearPosition(coords, 2)); },
});


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapView);
