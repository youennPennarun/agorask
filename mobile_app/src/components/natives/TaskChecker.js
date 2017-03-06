import { NativeModules } from 'react-native';

type TaskCheckerType = {
  start: Function,
  stop: Function,
};
const TaskChecker: TaskCheckerType = NativeModules.TaskChecker;

module.exports = TaskChecker;
