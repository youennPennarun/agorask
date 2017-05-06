
import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import Tasks from '../venueDetails/task/Tasks';

function UserTasks({tasks, navigator}) {
  return (
    <View style={styles.container}>
      <Tasks
        tasks={tasks || []}
        goToTask={(id, task, position) => {
          navigator.taskDetails(id, task, position);
        }} />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9e9e9',
  },
});

function mapStateToProps(state) {
  return {
    ...state.user,
  };
}

const UserTasksQuery = gql`
  query UserTasks($token: String!) {
    userTasks(token: $token) {
      ...Tasks
    }
  }
  ${Tasks.fragments.tasks}
`;

export default compose(
  connect(mapStateToProps),
  graphql(UserTasksQuery, {
    options: ({ token }) => ({
      variables: {
        token,
      },
    }),
    props: ({ ownProps, data: { loading, error, userTasks } }) => {
      if (error) console.log('Error', error);
      return {
        isFetching: loading,
        tasks: userTasks,
        error,
        navigator: ownProps.navigator,
      };
    },
  })
)(UserTasks);
