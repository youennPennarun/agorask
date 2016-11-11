import React, {Component, PropTypes} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import Task from './Task';

const {width} = Dimensions.get('window');

class Tasks extends Component {
  _renderTask(task, key): any {
    return (
      <View key={key} >
        <Task title={task.title} nbAnswers={task.nbAnswers} />
        <View style={styles.separator} />
      </View>
    );
  }
  _renderSeparator() {
  }
  render(): any {
    const {tasks} = this.props;
    return (
      <View style={styles.container}>
        {tasks.map((task, key) => this._renderTask(task, key))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    backgroundColor: 'white',
  },
  separator: {
    width,
    height: 1,
    backgroundColor: 'blue',
  }
});

Tasks.propTypes = {
  tasks: PropTypes.array.isRequired,
};

export default Tasks;