import React, {PropTypes} from 'react';
import gql from 'graphql-tag';
import {View, Text, StyleSheet, Dimensions, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

const {width} = Dimensions.get('window');

function getIcon(amenity) {
  return 'globe';
}
function renderAddress(formattedAddress) {
  if (typeof formattedAddress === 'string') {
    return (<Text>{formattedAddress }</Text>);
  } else if (formattedAddress instanceof Array) {
    return (
      <View>{formattedAddress.map((line, key) => <Text key={key}>{line}</Text>)}</View>
    );
  }
  return <View />;
}

function renderLoading() {
  return (
    <View style={[styles.block]} >
      <ActivityIndicator />
    </View>
  );
}

function VenueDescription(props) {
  const {name, address = {}, categories = [], website, contact = {}} = props.venue;
  const categoryName = (categories.length) ? categories[0].name : '';
  if (props.loading) return renderLoading();
  return (
    <View style={styles.block} >
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
        {(contact && contact.formattedPhone) ? (
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
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    elevation: 2,
  },
  icon: {
    marginRight: 15,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  venueName: {
    fontSize: 21,
    color: '#212121',
  },
});

VenueDescription.propTypes = {
  venue: PropTypes.object.isRequired,
};

VenueDescription.fragments = {
  venue: gql`
    fragment VenueDescription on Venue {
      name,
      address {
        formatted
      }
      categories {
        name 
      }
      website,
      contact {
        formattedPhone
      }
    }
  `,
};

export default VenueDescription;
