import React, {Component, PropTypes} from 'react';
import {View, Image, StyleSheet, Dimensions} from 'react-native';
import { connect } from 'react-redux';

import VenueDescription from './VenueDescription';
import Tasks from './task/Tasks';


const {width, height} = Dimensions.get('window');


export class VenueDetails extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.coverImage}
          resizeMode='cover'
          source={{uri: 'https://www.timeshighereducation.com/sites/default/files/Pictures/web/e/b/v/queens-university-belfast.jpg'}} />
        <VenueDescription venue={this.props.venue} />
        <Tasks tasks={this.props.venue.tasks} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9e9e9',
  },
  coverImage: {
    width: width,
    height: height * 0.3,
  },
  block: {
    backgroundColor: 'white',
    marginTop: 5,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  venueName: {
    fontSize: 20,
  },
});

VenueDetails.propTypes = {
  selectedVenueIndex: PropTypes.number.isRequired,
};
const mapStateToProps = (state, props) => ({
  venue: state.venues.venues[props.selectedVenueIndex],
});


export default connect(
  mapStateToProps,
)(VenueDetails);
