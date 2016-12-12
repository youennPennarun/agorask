import React, {Component, PropTypes} from 'react';
import gql from 'graphql-tag';
import {View, StyleSheet, Dimensions, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

import Task from './Task';

const {width} = Dimensions.get('window');

class Tasks extends Component {
  state = {
    openTasksExtended: false,
    resolvedTasksExtended: false,
  }
  _getResolvedTasks() {
    const {tasks} = this.props;
    const {resolvedTasksExtended} = this.state;
    const openTasks = tasks.filter(t => (t.nbAnswers > 0));
    return (resolvedTasksExtended) ? openTasks : openTasks.slice(0, 3);
  }
  _getOpenTasks() {
    const {tasks} = this.props;
    const {openTasksExtended} = this.state;
    const openTasks = tasks.filter(t => (t.nbAnswers === 0));
    return (openTasksExtended) ? openTasks : openTasks.slice(0, 3);
  }
  _renderTask(task, key): any {
    return (
      <TouchableOpacity key={key}
        onPress={() => { this.props.goToTask(task._id, task); }} >
        <Task title={task.title} nbAnswers={task.nbAnswers} />
        <View style={styles.separator} />
      </TouchableOpacity>
    );
  }
  render(): any {
    const resolved = this._getResolvedTasks();
    const open = this._getOpenTasks();
    return (
      <View style={styles.container}>
        {
          (open.length) ? (
            <View>
            <Text style={styles.title}>
              <Icon name='chevron-thin-down'
                style={styles.extendIcon}
                size={20} />
              Open Tasks
            </Text>
            <View style={styles.tasksContainer}>
              {open.map((task, key) => this._renderTask(task, key))}
            </View>
          </View>
        ) : null}
        {
          (resolved.length) ? (
            <View>
              <Text style={styles.title}>Resolved Tasks</Text>
              <View style={styles.tasksContainer}>
                {resolved.map((task, key) => this._renderTask(task, key))}
              </View>
            </View>
          ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    marginBottom: 30,
  },
  tasksContainer: {
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: 'white',
    elevation: 1,
  },
  extendIcon: {
    marginRight: 15,
  },
  title: {
    marginLeft: 15,
    fontSize: 25,
    color: '#212121',
  },
  separator: {
    width,
    height: 1,
    backgroundColor: '#f0f0f0',
  },
});

Tasks.propTypes = {
  tasks: PropTypes.array.isRequired,
  goToTask: PropTypes.func.isRequired,
};

Tasks.fragments = {
  venue: gql`
    fragment Tasks on Venue {
      tasks {
        _id
        title,
        nbAnswers
      }
    }
  `,
};

export default Tasks;
