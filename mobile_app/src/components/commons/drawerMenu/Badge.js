/* @flow */
import React, {PropTypes} from 'react';
import {View, Text, StyleSheet} from 'react-native';

type BadgePropsType = {
  value: number,
  badgeColor?: string,
  fontColor?: string,
};

export default function Badge(props: BadgePropsType): Object {
  const {value} = props;
  let text = value;
  if (value >= 100) {
    text = '99+';
  }
  const badgeColor = props.badgeColor || 'red';
  const fontColor = props.fontColor || 'white';
  return (
    <View style={[styles.container, {backgroundColor: badgeColor}]}>
      <Text style={[styles.value, {color: fontColor}]}>{text}</Text>
    </View>
  );
}

Badge.propTypes = {
  value: PropTypes.number.isRequired,
  badgeColor: PropTypes.string,
  fontColor: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 10,
    height: 20,
    width: 30,
    borderRadius: 10,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 15,
  },
});
