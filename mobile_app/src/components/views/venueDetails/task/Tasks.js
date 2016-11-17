import React, {Component, PropTypes} from 'react';
import {View, StyleSheet, Dimensions, Text} from 'react-native';
import Task from './Task';
import Icon from 'react-native-vector-icons/Entypo';

const {width} = Dimensions.get('window');

class Tasks extends Component {
  state = {
    openTasksExtended: false,
    resolvedTasksExtended: false,
  }
  _renderTask(task, key): any {
    return (
      <View key={key} >
        <Task title={task.title} nbAnswers={task.nbAnswers} />
        <View style={styles.separator} />
      </View>
    );
  }
  _getOpenTasks() {
    const {tasks} = this.props;
    const {openTasksExtended} = this.state;
    const openTasks = tasks.filter(t => (t.nbAnswers === 0));
    return (openTasksExtended) ? openTasks : openTasks.slice(0, 3);
  }
  _getResolvedTasks() {
    const {tasks} = this.props;
    const {resolvedTasksExtended} = this.state;
    const openTasks = tasks.filter(t => (t.nbAnswers > 0));
    return (resolvedTasksExtended) ? openTasks : openTasks.slice(0, 3);
  }
  render(): any {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          <Icon name='chevron-thin-down'
            style={styles.extendIcon}
            size={20} />
          Open Tasks
        </Text>
        <View style={styles.tasksContainer}>
          {this._getOpenTasks().map((task, key) => this._renderTask(task, key))}
        </View>
        <Text style={styles.title}>Resolved Tasks</Text>
        <View style={styles.tasksContainer}>
          {this._getResolvedTasks().map((task, key) => this._renderTask(task, key))}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    marginBottom: 10,
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
};

export default Tasks;