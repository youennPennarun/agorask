import React, {Component, PropTypes} from 'react';
import {View, Image, StyleSheet, Dimensions, ScrollView} from 'react-native';
import { connect } from 'react-redux';


import VenueDescription from './VenueDescription';
import Tasks from './task/Tasks';

import {getSelectedVenue} from '../../../redux/actions/venue';
import {pushRoute} from '../../../redux/actions/router';


const {width, height} = Dimensions.get('window');


export class VenueDetails extends Component {

  componentWillMount() {
    this.props.getVenueDetails();
  }

  render() {
    let imageUri = 'http://www.eltis.org/sites/eltis/files/default_images/photo_default_4.png';
    if (this.props.venue._id) {
      imageUri = `http://192.168.0.10:3000/venues/${this.props.venue._id}/image`;
    }

    return (
      <View style={styles.container}>
        <Image style={styles.coverImage}
          resizeMode='cover'
          source={{uri: imageUri}} />
        <ScrollView style={styles.scollView}>
          <VenueDescription venue={this.props.venue} />
          <Tasks tasks={this.props.venue.tasks || []}
            goToTask={id => { this.props.goToTaskDetails(id); }} />
        </ScrollView>
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
  scollView: {
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
  _id: PropTypes.string,
  sourceId: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
};
const mapStateToProps = state => {
  const {isFetching, venue} = state.selectedVenue;
  return {
    venue,
    isFetching,
  };
};

const mapDispatchToProps = (dispatch: Function, props): Object => ({
  getVenueDetails: () => {
    if (props._id) {
      dispatch(getSelectedVenue(props._id));
    } else {
      dispatch(getSelectedVenue(props.sourceId, props.source));
    }
  },
  goToTaskDetails: id => {
    dispatch(pushRoute({
      key: 'taskDetails',
      id,
    }));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VenueDetails);
