import React, {Component, PropTypes} from 'react';
import gql from 'graphql-tag';
import {View, StyleSheet, Dimensions, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

import Task from './Task';

const {width, height} = Dimensions.get('window');

const NB_TASK_TO_SHOW = 3;

class Tasks extends Component {
  state = {
    openTasksExtended: false,
    resolvedTasksExtended: false,
  }
  _getResolvedTasks(skipSlice) {
    const {tasks} = this.props;
    const {resolvedTasksExtended} = this.state;
    const openTasks = tasks.filter(t => (t.nbAnswers > 0));
    return (resolvedTasksExtended || skipSlice) ? openTasks : openTasks.slice(0, NB_TASK_TO_SHOW);
  }
  _getOpenTasks(skipSlice) {
    const {tasks} = this.props;
    const {openTasksExtended} = this.state;
    const openTasks = tasks.filter(t => (t.nbAnswers === 0));
    return (openTasksExtended || skipSlice) ? openTasks : openTasks.slice(0, NB_TASK_TO_SHOW);
  }
  _renderShowMoreButton(type) {
    let tasks;
    let nextState = {};
    let label = '';
    if (type === 'open') {
      tasks = this._getOpenTasks(true);
      nextState = {openTasksExtended: !this.state.openTasksExtended};
      label = (this.state.openTasksExtended) ? 'LESS' : 'MORE';
    } else if (type === 'resolved') {
      tasks = this._getResolvedTasks(true);
      nextState = {resolvedTasksExtended: !this.state.resolvedTasksExtended};
      label = (this.state.resolvedTasksExtended) ? 'LESS' : 'MORE';
    } else {
      return null;
    }
    if (tasks.length <= NB_TASK_TO_SHOW) {
      return null;
    }

    return (
      <TouchableOpacity onPress={() => { this.setState(nextState); }}>
        <View style={styles.showMorebutton}>
          <Text style={styles.showMoreButtonLabel} >{label}</Text>
        </View>
      </TouchableOpacity>
    );
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
            <View style={(this.state.openTasksExtended) ? styles.taskListExtended : undefined} >
              <View style={styles.blockHeader}>
                <Text style={styles.title}>
                  Open Tasks
                </Text>
              {this._renderShowMoreButton('open')}
              </View>
              <View style={styles.tasksContainer}>
                {open.map((task, key) => this._renderTask(task, key))}
              </View>
            </View>
        ) : null}
        {
          (resolved.length) ? (
            <View>
              <View style={styles.blockHeader}>
                <Text style={styles.title}>
                  Resolved Tasks
                </Text>
              {this._renderShowMoreButton('resolved')}
              </View>
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
  taskListExtended: {
    minHeight: height,
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
  blockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  showMorebutton: {
    marginRight: 10,
    justifyContent: 'center',
  },
  showMoreButtonLabel: {
    fontWeight: '900',
    fontSize: 16,
    color: '#8BC34A',
  },
});

Tasks.propTypes = {
  tasks: PropTypes.array.isRequired,
  goToTask: PropTypes.func.isRequired,
};

Tasks.fragments = {
  tasks: gql`
    fragment Tasks on Venue {
      tasks {
        ...Task
      }
    }
    ${Task.fragments.task}
  `,
};

export default Tasks;
