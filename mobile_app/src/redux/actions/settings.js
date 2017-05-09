/* @flow */
import TaskChecker from '../../components/natives/TaskChecker';

export const SET_NOTIFICATIONS = 'SETTINGS_SET_NOTIFICATIONS';

export function setNotifications(enabled: Boolean): {type: string, enabled: Boolean} {
  if (enabled) {
    TaskChecker.start();
  } else {
    TaskChecker.stop();
  }
  return {
    type: SET_NOTIFICATIONS,
    enabled,
  };
}
