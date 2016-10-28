/* @flow */

import React, {PropTypes} from 'react';
import {View, requireNativeComponent} from 'react-native';


// eslint-disable-next-line react/prefer-es6-class
function MarkerWrapper(props): Object {
  return (
    <MapMarker {...props} />
  );
}

MarkerWrapper.propTypes = {
  ...View.propTypes,
  coordinate: PropTypes.shape({
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
  }).isRequired,
};

const MapMarker = requireNativeComponent('RNMarker', MarkerWrapper, {
  nativeOnly: {},
});

module.exports = MarkerWrapper;
