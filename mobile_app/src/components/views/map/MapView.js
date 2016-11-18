/* @flow */
/* global navigator, alert */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import SearchBar from './SearchBar';

import Map from '../../natives/Map';
import MapMarker from '../../natives/MapMarker';
import {updateUserLocation} from '../../../redux/actions/user';
import {getVenuesWithTasksNearPosition, setSelectedVenue} from '../../../redux/actions/venue';
import {pushRoute} from '../../../redux/actions/router';

export class MapView extends React.Component {
  state = {
    position: null,
    x: 50, y: 50,
  };

  componentDidMount() {
    navigator.geolocation.getCurrentPosition((position) => {
        this._onGetPosition(position);
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition(position => {
      this._onGetPosition(position);
    });
  }
  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  watchID = null;

  _onGetPosition = ({coords}) => {
    this.props.updateUserLocation({lat: coords.latitude, lng: coords.longitude});
    this.props.getVenuesWithTasks(coords);
  }
  _goToVenueDetails(venue) {
    const {goToVenueDetails} = this.props;
    goToVenueDetails(venue);
  }
  _renderMarkers(venues) {
    return venues.map((venue, key) => (
      <MapMarker key={`${venue.address.location[1]}.${venue.address.location[0]}.${key}`}
        coordinate={{
          latitude: venue.address.location[1],
          longitude: venue.address.location[0],
        }}
        onPress={() => {
          this._goToVenueDetails(venue);
        }}
        numberOfTasks={venue.nbTasks} />
    ));
  }
  render() {
    const {venues, searchResults} = this.props;
    const venuesToShow = (searchResults !== null) ? searchResults : venues;
    return (
      <View style={{flex: 1}}>
        <Map style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'red',
        }} >
          {this._renderMarkers(venuesToShow)}
        </Map>
        <SearchBar openDrawer={this.props.openDrawer} />
      </View>
    );
  }
}

MapView.propTypes = {};

const mapStateToProps = (state: Object): Object => ({
  venues: state.venues.venues,
  searchResults: state.search.venues,
});
const mapDispatchToProps = (dispatch: Function): Object => ({
  goToVenueDetails: (venue) => {
    dispatch(setSelectedVenue(venue));
    dispatch(pushRoute({
      key: 'venueDetails',
      _id: venue._id,
      sourceId: venue.foursquareId,
      source: 'foursquare',
    }));
  },
  getVenuesWithTasks: (coords) => {
    dispatch(getVenuesWithTasksNearPosition(coords, 2));
  },
  updateUserLocation: ({lat, lng}) => {
    dispatch(updateUserLocation(lat, lng));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapView);
