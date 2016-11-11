import React, {PropTypes} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

const {width} = Dimensions.get('window');

function getIcon(amenity) {
  if (amenity === 'pub') return 'drink';
  return 'globe';
}
function renderAddress(formattedAddress) {
  if (typeof formattedAddress === 'string') {
    return (<Text>{formattedAddress}</Text>);
  } else if (formattedAddress instanceof Array) {
    return (
      <View>{formattedAddress.map((line, key) => <Text key={key}>{line}</Text>)}</View>
    );
  }
  return <View />;
}

export default function VenueDescription(props) {
  const {name, address, categories = [], website, contact = {formattedPhone: ''}} = props.venue;
  const categoryName = (categories.length) ? categories[0].name : '';
  return (
    <View style={styles.block}>
      <View style={styles.titleContainer} >
        <Icon name={getIcon()}
          style={styles.icon}
          size={16}
          color='blue' />
        <Text style={styles.venueName}>{name}</Text>
      </View>
      {renderAddress(address.formatted)}
      <Text>{categoryName}</Text>
      <Text>{website}</Text>
      {(contact.formattedPhone) ? (
        <Text><Icon name={'mobile'}
          style={styles.icon}
          size={16}
          color='blue' />{contact.formattedPhone}
        </Text>) : null
      }
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
