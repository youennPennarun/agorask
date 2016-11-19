import React, { PropTypes} from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function Vote(props): any {
  const {score} = props;

  let scoreStatusStyle = {};
  if (score > 1) {
    scoreStatusStyle = styles.good;
  } else if (score < -1) {
    scoreStatusStyle = styles.bad;
  }
  return (
    <View style={styles.container}>
      <Text style={styles.arrow}>+</Text>
      <Text style={[styles.score, scoreStatusStyle]}>{score}</Text>
      <Text style={styles.arrow}>-</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 55,
    height: 80,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
  },
  arrow: {
    flex: 1.1,
    fontSize: 19,
  },
  score: {
    fontSize: 17,
    flex: 0.8,
  },
  good: {
    color: 'green',
  },
  bad: {
    color: 'red',
  },
});

Vote.propTypes = {
  score: PropTypes.number.isRequired,
};
