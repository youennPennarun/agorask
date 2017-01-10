/* @flow */
/* global navigator, alert */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import SearchBar from './SearchBar';

import Map from '../../natives/Map';
import MapMarker from '../../natives/MapMarker';
import {updateUserLocation} from '../../../redux/actions/user';
import {getVenuesWithTasksNearPosition} from '../../../redux/actions/venue';
import {pushRoute} from '../../../redux/actions/router';

export class MapView extends React.Component {
  state = {
    position: null,
    x: 50,
    y: 50,
  };

  componentWillMount() {
    navigator.geolocation.getCurrentPosition((position) => {
        this._onGetPosition(position);
      },
      (error) => console.log(JSON.stringify(error)),
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
  }
  _goToVenueDetails(venue) {
    const {goToVenueDetails} = this.props;
    goToVenueDetails(venue);
  }
  _renderMarkers(venues = []) {
    return venues.map((venue, key) => {
      const cKey = `${venue.source || 'bd'}_${venue._id || venue.foursquareId}`;
      return (
        <MapMarker key={key}
          coordinate={{
            latitude: venue.address.location[1],
            longitude: venue.address.location[0],
          }}
          onPress={() => {
            this._goToVenueDetails(venue);
          }}
          numberOfTasks={venue.nbTasks} />
      );
    });
  }
  render() {
    const {venues, searchResults, venuesError} = this.props;
    console.log('error=> ', venuesError)
    const venuesToShow = (!!searchResults) ? searchResults : venues;
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

MapView.fragments = {
  venues: gql`
    fragment MapViewVenues on Venue {
      _id,
      foursquareId,
      name,
      source,
      nbTasks
      address {
        location,
      },
    }
  `,
};

const VenuesNearUserQuery = gql`
  query VenuesNearUser($lat: Float!, $lng: Float!, $radius: Float) {
    venuesWithinRadius(lat: $lat, lng: $lng, radius: $radius) {
      ...MapViewVenues
    }
  }
  ${MapView.fragments.venues}
`;

const SearchVenuesQuery = gql`
  query SearchVenues($lat: Float!, $lng: Float!, $radius: Float, $query: String!) {
    searchVenues(lat: $lat, lng: $lng, radius: $radius, query: $query) {
      ...MapViewVenues
    }
  }
  ${MapView.fragments.venues}
`;


/* istanbul ignore next */
const mapStateToProps = (state: Object): Object => ({
  userLocation: state.userLocation,
  query: state.search.query,
});
/* istanbul ignore next */
const mapDispatchToProps = (dispatch: Function): Object => ({
  goToVenueDetails: (venue) => {
    dispatch(pushRoute({
      key: 'venueDetails',
      _id: venue._id,
      id: venue._id,
      sourceId: venue.foursquareId,
      source: 'foursquare',
    }));
  },
  updateUserLocation: ({lat, lng}) => {
    dispatch(updateUserLocation(lat, lng));
  },
});


/* istanbul ignore next */
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  graphql(VenuesNearUserQuery, {
    skip: ({userLocation}): boolean => (!userLocation || !userLocation.coords),
    options: ({ userLocation: {coords} }): Object => ({
      variables: {
        lat: coords.lat,
        lng: coords.lng,
        radius: 4000,
      },
    }),
    props: ({ ownProps, data: { loading, error, venuesWithinRadius } }) => ({
      ...ownProps,
      loading,
      venuesError: error,
      venues: venuesWithinRadius,
    }),
  }),
  graphql(SearchVenuesQuery, {
    skip: ({userLocation, query}): boolean => (!query || !userLocation || !userLocation.coords),
    options: ({ userLocation: {coords}, query }): Object => ({
      variables: {
        lat: coords.lat,
        lng: coords.lng,
        radius: 4000,
        query,
      },
    }),
    props: ({ ownProps, data: { loading, error, searchVenues } }) => ({
      ...ownProps,
      loading,
      searchError: error,
      searchResults: searchVenues,
    }),
  }),
)(MapView);
