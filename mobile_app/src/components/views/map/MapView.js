/* @flow */
/* global navigator, alert */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import geohash from 'ngeohash';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import SearchBar from './SearchBar';

import Map from '../../natives/Map';
import MapMarker from '../../natives/MapMarker';
import Error from '../../commons/Error';
import {updateUserLocation} from '../../../redux/actions/user';
import {pushRoute} from '../../../redux/actions/router';

import Location from '../../../utils/Location';



export class MapView extends React.Component {
  state = {
    position: null,
    x: 50,
    y: 50,
    rev: false,
  };

  componentWillMount() {
    Location.getCurrentPosition((position) => {
        this._onGetPosition(position);
      },
      (error) => { console.log(JSON.stringify(error)); },
      {enableHighAccuracy: true, timeout: 60000},
    );
    this.watchID = Location.watchPosition(position => {
      this._onGetPosition(position);
    });
  }
  componentWillUnmount() {
    Location.clearWatch(this.watchID);
  }

  watchID = null;

  _onGetPosition = ({coords}) => {
    this.props.updateUserLocation({lat: coords.latitude, lng: coords.longitude});
  }

  _goToVenueDetails(venue, {x, y}) {
    const {goToVenueDetails} = this.props;
    goToVenueDetails(venue, {x, y});
  }

  _renderMarkers(venues: Array<Object> = []): Array<MapMarker> {
    return venues.map((venue, key) => {
      return (
        <MapMarker key={key}
          accessibilityLabel={venue.name}
          coordinate={{
            latitude: venue.address.location[1],
            longitude: venue.address.location[0],
          }}
          onPress={({nativeEvent}) => {
            this._goToVenueDetails(venue, nativeEvent);
          }}
          numberOfTasks={venue.nbOpenTasks} />
      );
    });
  }
  render(): React.Element<*> {
    const {venues, searchResults, venuesError} = this.props;
    console.log(searchResults, venues, venuesError)
    const venuesToShow = searchResults || venues;
    return (
      <View style={{flex: 1}}>
        <Map style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'red',
        }} >
          {this._renderMarkers(venuesToShow)}
        </Map>
        <SearchBar openDrawer={this.props.openDrawer} />
        <Error error={venuesError} />
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
      nbOpenTasks
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
VenuesNearUserQuery.offline = ({lat, lng}) => ({geohash: geohash.encode(lat, lng, 8)});

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
  searchResults: state.search.venues,
});
/* istanbul ignore next */
const mapDispatchToProps = (dispatch: Function): Object => ({
  goToVenueDetails: (venue, position) => {
    dispatch(pushRoute({
      key: 'venueDetails',
      _id: venue._id,
      id: venue._id,
      sourceId: venue.foursquareId,
      source: 'foursquare',
      position,
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
      pollInterval: 5 * 60 * 1000,
    }),
    props: ({ ownProps, data: { loading, error, venuesWithinRadius } }) => ({
      ...ownProps,
      loading,
      venuesError: error,
      venues: venuesWithinRadius,
    }),
  }),
  /*
  graphql(SearchVenuesQuery, {
    skip: ({userLocation, query}): boolean => (!query || !userLocation || !userLocation.coords),
    options: ({ userLocation: {coords}, query }): Object => {
      console.log({
        lat: coords.lat,
        lng: coords.lng,
        radius: 4000,
        query,
      })
      return ({
      variables: {
        lat: coords.lat,
        lng: coords.lng,
        radius: 4000,
        query,
      },
    })
  },
    props: ({ ownProps, data: { loading, error, searchVenues } }) => {
    console.log("==============================>", ({
      ...ownProps,
      loading,
      searchError: error,
      searchResults: searchVenues,
    }));
    return ({
      ...ownProps,
      loading,
      searchError: error,
      searchResults: searchVenues,
    })
  },
}),
*/
)(MapView);
