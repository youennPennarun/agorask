/* @flow */
import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, Dimensions, Animated, TouchableOpacity } from 'react-native';

import TaskHeader from '../../taskDetails/TaskHeader';

const { width } = Dimensions.get('window');

type TaskType = {
  _id: string,
  title: string,
  nbAnswers: number,
  postedBy: {
    username: string,
  },
};

type TaskListStateType = {
  animationState: Object,
  tasks: Array<TaskType>,
};
type TaskListPropsType = {
  tasks: Array<TaskType>,
  goToTask: Function,
};

function tasksChanged(prev: Array<Object>, next: Array<Object>): boolean {
  return prev.length !== next.length ||
    !prev.every((el, index) => next[index] || el._id === next[index]._id);
}

class TaskList extends Component {
  state: TaskListStateType = {
    animationState: {},
    tasks: [],
  };
  props: TaskListPropsType;
  /* eslint-disable react/sort-comp */
  pendingExitAnimations: Array<Animated.timing> = [];
  pendingEnterAnimations: Array<Animated.timing> = [];

  taskRefs = {};
  /* eslint-enable react/sort-comp */

  setTaskRef = (ref: React.Element<*>, taskId: string) => {
    this.taskRefs[taskId] = ref;
  };

  constructor(props: TaskListPropsType) {
    super(props);
    this.state = { ...this.state, ...this.buildAnimations([], props.tasks, {}) };
  }
  componentDidMount() {
    this.animate();
  }

  componentWillReceiveProps(next: TaskListPropsType) {
    if (tasksChanged(this.props.tasks, next.tasks)) {
      this.setState(
        state => {
          return {
            ...this.buildAnimations(this.props.tasks, next.tasks, state.animationState),
          };
        },
        () => {
          this.animate();
        },
      );
    }
  }

  buildAnimations(
    currentTasks: Array<TaskType>,
    nextTasks: Array<TaskType>,
    animationState: Object,
  ): TaskListStateType {
    const nextAnimationState = { ...animationState };
    this.pendingEnterAnimations = [];
    this.pendingExitAnimations = [];
    const tasks = [];

    currentTasks.forEach(task => {
      if (!nextTasks.find(t => t._id === task._id)) {
        this.pendingExitAnimations.push(
          Animated.timing(nextAnimationState[task._id], {
            toValue: -width,
          }),
        );
      }
      tasks.push(task);
    });
    nextTasks.forEach(task => {
      if (!currentTasks.find(t => t._id === task._id)) {
        nextAnimationState[task._id] = new Animated.Value(-width);
        this.pendingEnterAnimations.push(
          Animated.timing(nextAnimationState[task._id], {
            toValue: 0,
          }),
        );
        tasks.push(task);
      }
    });
    return {
      animationState: nextAnimationState,
      tasks,
    };
  }
  animate() {
    Animated.parallel([
        Animated.stagger(200, this.pendingEnterAnimations),
        Animated.stagger(200, this.pendingExitAnimations.reverse()),
      ])
      .start(() => {
        this.setState((state, props) => {
          const cleanedState = {};
          this.props.tasks.forEach(task => {
            cleanedState[task._id] = state.animationState[task._id];
          });
          return {
            animationState: cleanedState,
            tasks: props.tasks,
          };
        });
      });
  }
  goToTask(task: TaskType) {
    this.taskRefs[task._id].measure((ox, oy, taskWidth, taskHeight, px, py) => {
      this.props.goToTask(task._id, task, { y: py });
    });
  }
  _renderRow(task, key): React.Element<*> {
    return (
      <Animated.View
        key={key}
        style={{
          transform: [
            {
              translateX: this.state.animationState[task._id],
            },
          ],
        }}>
        <TouchableOpacity
          key={key}
          style={{
            marginVertical: 1,
            paddingVertical: 2,
          }}
          ref={ref => {
            this.setTaskRef(ref, task._id);
          }}
          onPress={() => {
            this.goToTask(task);
          }}>
          <TaskHeader title={task.title} nbAnswers={task.nbAnswers} postedBy={task.postedBy} />
        </TouchableOpacity>
      </Animated.View>
    );
  }
  render(): any {
    return (
      <View style={[styles.container]}>
        {this.state.tasks.map((task, key) => this._renderRow(task, key))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  list: {},
});

export default TaskList;
