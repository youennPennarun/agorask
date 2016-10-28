/* @flow */

import React, {Component, PropTypes} from 'react';
import {View, requireNativeComponent} from 'react-native';


// eslint-disable-next-line react/prefer-es6-class
class MapWrapper extends Component {
  state = {
    isMapReady: false,
  }

  _onMapReady() {
    if (this.props.onMapReady) {
      this.props.onMapReady();
    }
    this.setState({isMapReady: true});
  }

  render(): Object {
    let props = {
        style: this.props.style,
        onMapReady: () => { this._onMapReady(); },
    };
    if (this.state.isMapReady) {
      props = {
        ...props,
        ...this.props,
      };
    }

    return (
      <Map {...props} />
      );
  }
}

MapWrapper.propTypes = {
  ...View.propTypes,
  onMapReady: PropTypes.func,
};


const Map = requireNativeComponent('RNMap', MapWrapper, {
  nativeOnly: {
    onRegionChange: true,
  },
});

module.exports = MapWrapper;
