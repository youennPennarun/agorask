import React, {Component, PropTypes} from 'react';
import {View, StyleSheet} from 'react-native';
import Task from './Task';

class Tasks extends Component {
  _renderTask(task, key): any {
    return <Task key={key} title={task.title} nbAnswers={task.nbAnswers} />;
  }
  render(): any {
    const {tasks} = this.props;
    return (
      <View>
        {tasks.map((task, key) => this._renderTask(task, key))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
});

Tasks.propTypes = {
  tasks: PropTypes.array.isRequired,
};

export default Tasks;