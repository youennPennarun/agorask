/* @flow */
import React from 'react';
import { View, Text, StyleSheet, Dimensions, Switch } from 'react-native';
import { connect } from 'react-redux';

import type { SettingsStateType } from '../../../redux/reducers/settings';

import { setNotifications } from '../../../redux/actions/settings';

const { width } = Dimensions.get('window');

function Header(): React.Element<View> {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Settings</Text>
    </View>
  );
}

type SettingsPropsType = SettingsStateType & DispatchToPropsType;

function Settings(props: SettingsPropsType): React.Element<View> {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.row}>
        <Text style={styles.label}>Notifications: </Text>
        <Switch onValueChange={(enabled: Boolean) => {
            props.setNotifications(enabled);
          }}
          value={props.notifications} />
      </View>
      <View style={styles.separator} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  header: {
    paddingLeft: 20,
    justifyContent: 'center',
    width,
    height: 50,
    backgroundColor: 'white',
    elevation: 2,
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
  },
  label: {
    fontSize: 20,
    alignSelf: 'center',
  },
  row: {
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
  },
  spearator: {
    backgroundColor: '#e9e9e9',
    width,
    height: 10,
  },
});

const mapStateToProps = (state): SettingsStateType => {
  return {
    ...state.settings,
  };
};

type DispatchToPropsType = {
  setNotifications: Function,
};
const mapDispatchToProps = (dispatch): DispatchToPropsType => {
  return {
    setNotifications: (enabled: Boolean) => {
      dispatch(setNotifications(enabled));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
