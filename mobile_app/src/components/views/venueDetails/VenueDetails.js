import React, {Component, PropTypes} from 'react';
import {View, Image, Text, StyleSheet, Dimensions, ScrollView} from 'react-native';

import {connect} from 'react-redux';

import Icon from 'react-native-vector-icons/EvilIcons';
import update from 'immutability-helper';

import RoundButton from '../../commons/RoundButton';

import AddTask from './task/AddTask';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';


import VenueDescription from './VenueDescription';
import Tasks from './task/Tasks';


const {width, height} = Dimensions.get('window');

function renderFetchingState() {
  return <View />;
}

function renderError(error) {
  console.log(error);
  return (
    <View>
      <Text>Error: {error}</Text>
    </View>
  )
}

export class VenueDetails extends Component {
  state = {
    showAddTask: false,
  }

  addTask(task) {
    this.props.addTask(this.props.venue._id, task, this.props.token);
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
        <ScrollView style={styles.scollView}>
          <Image style={styles.coverImage}
            resizeMode='cover'
            source={{uri: imageUri}} />
          <VenueDescription venue={venue} />
          <Tasks tasks={venue.tasks || []}
            goToTask={(id, task) => { this.props.navigator.taskDetails(id, task); }} />
        </ScrollView>
        <AddTask style={styles.addTask}
          visible={this.state.showAddTask}
          addTask={task => { this.addTask(task); }} />

        <RoundButton style={styles.addTaskBtn}
          size={50}
          initialState={{
            color: 'green',
            renderIcon: () => <Icon name='plus' size={42} color='white' />,
            callback: () => this.setState({showAddTask: true}),
          }}
          activatedState={{
            color: 'red',
            renderIcon: () => <Icon name='close' size={42} color='white' />,
            callback: () => this.setState({showAddTask: false}),
          }} />
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
    height,
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
  addTask: {
  }
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


const AddTaskMutation = gql`
  mutation task($taskId: ID!, $task: TaskInput!, $token: String!) {
    task(venueId: $taskId, task: $task, token: $token) {
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

const VenueDetailsConnected = connect(mapStateToProps)(VenueDetails);

export default graphql(AddTaskMutation, {
  props: ({ownProps, mutate}) => ({
      addTask: (taskId, task, token) => mutate({
        variables: {taskId, task, token},
        optimisticResponse: {
          __typename: 'Mutation',
          task: {
            __typename: 'Task',
            task: task,
            date: new Date(),
            postedBy: {
              username: '',
            },
          },
        },
        updateQueries: {
          VenueDetails: (prev, { mutationResult }) => {
            const newTask = mutationResult.data.task;
            const existing = null; // prev.task.answers.find(existingAnswer => existingAnswer.answer === newAnswer.answer);
            /*
            if (existing) {
              return prev;
            }
            */
            return update(prev, {
              venue: {
                tasks: { $push: [newTask] },
              },
            });
          },
        },
      }),
  }),
})(graphql(VenueDetailsQuery, {
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
})(VenueDetailsConnected));
