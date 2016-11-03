import React, {Component, PropTypes} from 'react';
import {View, Text, StyleSheet} from 'react-native';

class Task extends Component {
  render() {
    const {title, nbAnswers} = this.props;
    return (
      <View style={styles.container} >
        <View style={styles.header} >
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.nbAnswers}>{`${nbAnswers} answers`}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 40,
  },
  header: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 16,
    flex: 3,
  },
  nbAnswers: {
    flex: 1,
  },
});

Task.propTypes = {
  title: PropTypes.string.isRequired,
  nbAnswers: PropTypes.number.isRequired,
};

export default Task;