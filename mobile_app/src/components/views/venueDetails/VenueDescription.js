import React, {Component, PropTypes} from 'react';
import {View, Text, Image, StyleSheet, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

const {width} = Dimensions.get('window');

function getIcon(amenity) {
  if (amenity === 'pub') return 'drink';
  return 'globe';
}
function getAddressString(address) {
  const {houseNumber = '', street = '', postcode = ''} = address;
  if (!street || !postcode) return '';
  return `${houseNumber} ${street} - ${postcode}`;
}

export default function VenueDescription(props) {
  const {name, address, amenity} = props.venue;
  return (
    <View style={styles.block}>
      <View style={styles.titleContainer} >
        <Icon name={getIcon(amenity)}
          style={styles.icon}
          size={16}
          color='blue' />
        <Text style={styles.venueName}>{name}</Text>
      </View>
      <Text style={{}}>{getAddressString(address)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    width,
    backgroundColor: 'white',
    marginTop: 5,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
  },
  icon: {
    marginRight: 15,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  venueName: {
    fontSize: 20,
  },
});

VenueDescription.propTypes = {
  venue: PropTypes.object.isRequired,
};
