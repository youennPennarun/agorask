/* @flow */
import { SET_NOTIFICATIONS } from '../actions/settings';

export type SettingsStateType = {
  notifications: boolean,
};

const initialState: SettingsStateType = {
  notifications: true,
};

function settings(
  currentState: SettingsStateType = initialState,
  action: Object,
): SettingsStateType {
  switch (action.type) {
    case SET_NOTIFICATIONS:
      return {
        ...currentState,
        notifications: action.enabled,
      };
    default:
      return currentState;
  }
}

export default {
  settings,
};
