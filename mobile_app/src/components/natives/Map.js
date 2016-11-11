/* @flow */

import React, {Component, PropTypes} from 'react';
import {View, requireNativeComponent, PixelRatio} from 'react-native';

const ratio = PixelRatio.get();

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
  _onLongPress(event) {
    const {x, y, lat, lng} = event.nativeEvent;
    if (this.props.onLongPress) {
      this.props.onLongPress(x / ratio, y / ratio, lat, lng);
    }
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
        onLongPress: (event) => { this._onLongPress(event); },
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
