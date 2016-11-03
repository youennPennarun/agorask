/* @flow */

import React, {PropTypes} from 'react';
import {View, requireNativeComponent} from 'react-native';


// eslint-disable-next-line react/prefer-es6-class
function MarkerWrapper(props): Object {
  const onPress = props.onPress || (() => {});
  return (
    <MapMarker {...props}
      onPress={onPress} />
  );
}

MarkerWrapper.propTypes = {
  ...View.propTypes,
  coordinate: PropTypes.shape({
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
  }).isRequired,
  onPress: PropTypes.func,
};

const MapMarker = requireNativeComponent('RNMarker', MarkerWrapper);

module.exports = MarkerWrapper;
