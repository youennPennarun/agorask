import React, {Component, PropTypes} from 'react';
import gql from 'graphql-tag';
import {View, StyleSheet, Dimensions, Animated, Text, TouchableOpacity, ListView} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

import Task from './Task';

const {width} = Dimensions.get('window');

const NB_TASK_TO_SHOW = 3;

class TaskList extends Component {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: this.ds.cloneWithRows(props.tasks.slice(0, NB_TASK_TO_SHOW)),
    };
  }

  state = {
    extended: false,
  };
  minHeight = new Animated.Value(NB_TASK_TO_SHOW * Task.HEIGHT)

  extend() {
    const {tasks, extended} = this.props;
    const nextTasks = (extended) ? tasks.slice(0, NB_TASK_TO_SHOW) : tasks;
    this.setState({
      extended: !extended,
      dataSource: this.ds.cloneWithRows(nextTasks),
    });
  }

  _renderShowMoreButton() {
    const {tasks, extended} = this.props;
    if (tasks.length <= NB_TASK_TO_SHOW) {
      return null;
    }
    const label = (extended) ? 'LESS' : 'MORE';
    return (
      <TouchableOpacity onPress={() => { this.extend() }}>
        <View style={styles.showMorebutton}>
          <Text style={styles.showMoreButtonLabel} >{label}</Text>
        </View>
      </TouchableOpacity>
    );
  }
  _getContainerAnimation() {
    if (!this.state.extended) return {};
    return {
      minHeight: this.minHeight,
    };
  }
  _renderTask(task): any {
    return (
      <TouchableOpacity key={task._id}
        onPress={() => { this.props.goToTask(task._id, task); }} >
        <Task title={task.title} nbAnswers={task.nbAnswers} />
        <View style={styles.separator} />
      </TouchableOpacity>
    );
  }
  render(): any {
    const {label, filter} = this.props;
    const {extended} = this.state;
    return (
      <View style={[
        styles.container,
        this._getContainerAnimation(),
      ]}>
        <ListView style={styles.list}
          dataSource={this.state.dataSource}
          renderRow={task => this._renderTask(task)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    marginBottom: 30,
  },
  list: {

  },
});

TaskList.defaultProps = {
  label: '',
  tasks: [],
  fielter: task => task,
}

export default TaskList;
