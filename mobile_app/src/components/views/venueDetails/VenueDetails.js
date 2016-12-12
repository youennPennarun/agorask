import React, {Component, PropTypes} from 'react';
import {View, Image, Text, StyleSheet, Dimensions, ScrollView} from 'react-native';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';


import VenueDescription from './VenueDescription';
import Tasks from './task/Tasks';


const {width, height} = Dimensions.get('window');


function renderFetchingState() {
  return <View />;
}

function renderError(error) {
  console.log('{{{{{{{{{{{{{{{{{{Error}}}}}}}}}}}}}}}}}}}');
  console.log(error);
  console.log('{{{{{{{{{{{{{{{{{{{{{}}}}}}}}}}}}}}}}}}}}}');
  return (
    <View>
      <Text>Error</Text>
    </View>
  )
}

export class VenueDetails extends Component {

  componentWillMount() {
  }

  render() {
    const {venue, isFetching, error} = this.props;
    if (isFetching) return renderFetchingState();
    if (error) return renderError(error);
    let imageUri = 'http://www.eltis.org/sites/eltis/files/default_images/photo_default_4.png';
    if (venue._id) {
      imageUri = `http://192.168.0.10:3000/venues/${venue._id}/image`;
    }
    return (
      <View style={styles.container}>
        <Image style={styles.coverImage}
          resizeMode='cover'
          source={{uri: imageUri}} />
        <ScrollView style={styles.scollView}>
          <VenueDescription venue={venue} />
          <Tasks tasks={venue.tasks || []}
            goToTask={(id, task) => { this.props.navigator.taskDetails(id, task); }} />
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
/*
const mapStateToProps = state => ({});

const mapDispatchToProps = (dispatch: Function, props): Object => ({
  goToTaskDetails: id => {
    dispatch(pushRoute({
      key: 'taskDetails',
      id,
    }));
  },
});

const VenueConnected = connect(
  mapStateToProps,
  mapDispatchToProps,
)(VenueDetails);
*/

const VenueDetailsQuery = gql`
  query VenueDetails($id: ID!, $source: String) {
    venue(id: $id, source: $source) {
      ...VenueDescription
      ...Tasks
    }
  }
  ${VenueDescription.fragments.venue}
  ${Tasks.fragments.venue}
`;

export default graphql(VenueDetailsQuery, {
  options: ({ _id, sourceId, source }) => {
    const variables = {};
    if (_id) {
      variables.id = _id;
      variables.source = null;
    } else {
      variables.id = sourceId;
      variables.id = source;
    }
    return {variables};
  },
  props: ({ownProps, data: { loading, error, venue } }) => {
    return {
      isFetching: loading,
      venue: {
        _id: ownProps._id,
       ...venue,
      },
      error,
      navigator: ownProps.navigator,
    };
  },
})(VenueDetails);
