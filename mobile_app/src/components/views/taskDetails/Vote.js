/* @flow */
import React, { PropTypes} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

type VotePropsType = {
  score: number,
  userRating: ?number,
  onVote: ?Function,
}

function renderVoteButton(text: string, isSelected: boolean, value: number, onVote: ?Function): React.Component {
  if (!onVote) return <View style={styles.arrow} />;
  const iconStyle = (isSelected) ? [styles.icon, styles.selected] : styles.icon;
  return (
    <TouchableOpacity style={styles.arrow}
      onPress={() => {
        if (onVote) {
          onVote(value);
        }
      }} >
      <Text style={iconStyle} >{text}</Text>
    </TouchableOpacity>
  );
}

export default function Vote(props: VotePropsType): React.Element<Vote> {
  const {score, userRating, onVote} = props;
  let scoreStatusStyle = {};
  if (score > 1) {
    scoreStatusStyle = styles.good;
  } else if (score < -1) {
    scoreStatusStyle = styles.bad;
  }
  return (
    <View style={styles.container}>
      { renderVoteButton('+1', (userRating && userRating.rating > 0), 'POSITIVE', onVote) }
      <Text style={[styles.score, scoreStatusStyle]}>{score}</Text>
      { renderVoteButton('-1', (userRating && userRating.rating < 0), 'NEGATIVE', onVote) }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 55,
    height: 90,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
  },
  arrow: {
    flex: 1.1,
  },
  icon: {
    fontSize: 20,
  },
  score: {
    fontSize: 18,
    flex: 1.1,
  },
  good: {
    color: 'green',
  },
  bad: {
    color: 'red',
  },
  selected: {
    color: 'green',
  },
});

Vote.propTypes = {
  score: PropTypes.number.isRequired,
};
