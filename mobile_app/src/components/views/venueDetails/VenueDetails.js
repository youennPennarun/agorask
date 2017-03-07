/* @flow */

import React, { Component, PropTypes } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  ToastAndroid,
  BackAndroid,
} from 'react-native';

import Config from 'react-native-config';

import { connect } from 'react-redux';
import { pushVenue } from '../../../redux/actions/venue';

import Icon from 'react-native-vector-icons/EvilIcons';
import update from 'immutability-helper';

import RoundButton from '../../commons/RoundButton';
import Error from '../../commons/Error';

import AddTask from './task/AddTask';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import VenueDescription from './VenueDescription';
import Tasks from './task/Tasks';

import RadialAnimatedView from '../../natives/RadialAnimatedView';

const { width, height } = Dimensions.get('window');
const COVER_IMAGE_HEIGHT = height * 0.3;

export class VenueDetails extends Component {
  state = {
    showAddTask: false,
  };
  roundButtonRef: RoundButton = null;
  radialAnimatedViewRef: ?RadialAnimatedView = null;

  addTask(task): Promise<*> {
    const { _id, foursquareId, name, address, tasks = [] } = this.props.venue;

    this.props.pushVenueToMap({ _id, foursquareId, name, address, nbTasks: tasks.length + 1 });
    return this.props.addTask(this.props.venue._id, task, this.props.token);
  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this._onBack);
    setTimeout(() => {
      if (this.radialAnimatedViewRef) {
        this.radialAnimatedViewRef.reveal();
      }
    });
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this._onBack);
  }

  _onBack = (): boolean => {
    if (this.state.showAddTask) {
      if (this.roundButtonRef) this.roundButtonRef.setActive(false);
      return true;
    }
    if (this.props.isActive) {
      this.radialAnimatedViewRef.hide();
    }
    return false;
  };

  render(): React.Element {
    const { venue, isFetchingVenue, error } = this.props;

    let imageUri = 'http://www.eltis.org/sites/eltis/files/default_images/photo_default_4.png';
    if (venue._id) {
      imageUri = `${Config.API_URL}/venues/${venue._id}/image`;
    }
    return (
      <RadialAnimatedView
        ref={r => {
          this.radialAnimatedViewRef = r;
        }}
        style={styles.container}
        center={this.props.position}>
        <Image style={styles.coverImage} resizeMode='cover' source={{ uri: imageUri }} />
        <ScrollView
          style={styles.scollView}
          contentContainerStyle={styles.scrollViewContentContainer}>
          <View style={styles.scrollViewContent}>
            <VenueDescription loading={isFetchingVenue} venue={venue} />
            <Tasks
              tasks={venue.tasks || []}
              goToTask={(id, task, position) => {
                this.props.navigator.taskDetails(id, task, position);
              }} />
          </View>
        </ScrollView>
        <AddTask
          style={styles.addTask}
          isLoggedIn={!!this.props.token}
          visible={this.state.showAddTask}
          onClose={() => {
            if (this.roundButtonRef) this.roundButtonRef.setActive(false);
          }}
          addTask={(task): Promise<*> => this.addTask(task)} />

        <RoundButton
          ref={ref => {
            this.roundButtonRef = ref;
          }}
          style={styles.addTaskBtn}
          size={50}
          initialState={{
            color: 'green',
            renderIcon: () => <Icon name='plus' size={42} color='white' />,
            callback: () => this.setState({ showAddTask: true }),
          }}
          activatedState={{
            color: 'red',
            renderIcon: () => <Icon name='close' size={42} color='white' />,
            callback: () => this.setState({ showAddTask: false }),
          }} />
          <Error error={error} />
      </RadialAnimatedView>
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
    height: COVER_IMAGE_HEIGHT,
  },
  scollView: {
    position: 'absolute',
    top: 0,
    height,
  },
  scrollViewContentContainer: {
    paddingTop: COVER_IMAGE_HEIGHT,
  },
  scrollViewContent: {
    backgroundColor: '#e9e9e9',
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
  addTaskBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 5,
    right: 5,
    elevation: 20,
  },
  addTaskBtnLabel: {
    fontSize: 22,
    color: 'white',
  },
  addTask: {},
});

VenueDetails.propTypes = {
  _id: PropTypes.string,
  sourceId: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
};

VenueDetails.fragments = {
  venue: gql`
    fragment VenueDetails on Venue {
      _id,
      foursquareId,
      name,
      address {
        location,
      },
      ...VenueDescription
      ...Tasks
    }
    ${VenueDescription.fragments.venue}
    ${Tasks.fragments.tasks}
  `,
};

const VenueDetailsQuery = gql`
  query Venue($id: ID!, $source: String) {
    venue(id: $id, source: $source) {
      ...VenueDetails
    }
  }
  ${VenueDetails.fragments.venue}
`;

const AddTaskMutation = gql`
  mutation addTask($venueId: ID!, $task: TaskInput!, $token: String!) {
    task(venueId: $venueId, task: $task, token: $token) {
      title
      nbAnswers
    }
  }
`;

function mapStateToProps(state) {
  return {
    ...state.user,
  };
}

const mapDispatchToProps = (dispatch: Function): Object => {
  return {
    pushVenueToMap: venue => {
      dispatch(pushVenue(venue));
    },
  };
};

export default compose(
  graphql(VenueDetailsQuery, {
    options: ({ _id, sourceId, source }) => {
      const variables = {};
      if (_id) {
        variables.id = _id;
        variables.source = null;
      } else {
        variables.id = sourceId;
        variables.source = source;
      }
      return { variables };
    },
    props: ({ ownProps, data: { loading, error, venue } }) => {
      if (error) console.log('Error', error);
      return {
        isFetchingVenue: loading,
        venue: {
          _id: ownProps._id,
          ...venue,
        },
        error,
        navigator: ownProps.navigator,
      };
    },
  }),
  graphql(AddTaskMutation, {
    props: ({ ownProps, mutate }) => {
      return {
        addTask: (venueId, task, token) => mutate({
          variables: { venueId, task, token },
          optimisticResponse: {
            __typename: 'Mutation',
            task: {
              __typename: 'Task',
              _id: null,
              title: task.title,
              nbAnswers: 0,
            },
          },
          updateQueries: {
            VenuesNearUser: (prev, { mutationResult }) => {
              if (mutationResult.errors) {
                // TODO error handling
                if (mutationResult.errors.length) {
                  ToastAndroid.show(mutationResult.errors[0].message, ToastAndroid.SHORT);
                }
                return prev;
              }
              if (!prev.venuesWithinRadius) return prev;

              let venue = prev.venuesWithinRadius.find(
                v => v._id === ownProps.venue._id || v.foursquareId === ownProps.venue.foursquareId,
              );
              if (!venue) {
                venue = {
                  ...ownProps.venue,
                };
              }
              venue.nbTasks = venue.nbTasks ? venue.nbTasks + 1 : 1;
              const updated = update(prev, {
                venuesWithinRadius: {
                  $unshift: [venue],
                },
              });
              return updated;
            },
            Venue: (prev, { mutationResult }) => {
              if (mutationResult.errors) {
                // TODO error handling
                if (mutationResult.errors.length) {
                  ToastAndroid.show(mutationResult.errors[0].message, ToastAndroid.SHORT);
                }
                return prev;
              }
              if (!prev.venue) return prev;
              const newTask = mutationResult.data.task;

              const updated = update(prev, {
                venue: {
                  tasks: {
                    $unshift: [newTask],
                  },
                },
              });
              return updated;
            },
          },
        }),
      };
    },
  }),
  connect(mapStateToProps, mapDispatchToProps),
)(VenueDetails);
