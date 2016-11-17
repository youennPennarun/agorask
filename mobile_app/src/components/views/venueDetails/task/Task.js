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
    height: 65,
    justifyContent: 'center',
    marginLeft: 5,
  },
  header: {
    flexDirection: 'row',
  },
  title: {
    textAlignVertical: 'center',
    fontSize: 18,
    flex: 4,
    color: '#212121',
  },
  nbAnswers: {
    textAlign: 'center',
    textAlignVertical: 'center',
    flex: 1,
    color: '#BDBDBD',
  },
});

Task.propTypes = {
  title: PropTypes.string.isRequired,
  nbAnswers: PropTypes.number.isRequired,
};

export default Task;