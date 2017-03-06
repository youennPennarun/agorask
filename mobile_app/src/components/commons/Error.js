/* @flow */
import React, { PropTypes } from 'react';
import { Text, StyleSheet, Dimensions, Animated } from 'react-native';

const { width } = Dimensions.get('window');

class Error extends React.Component {
  state = {
    height: new Animated.Value(0),
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.error === nextProps.error) return;
    const toValue = (nextProps.error) ? FINAL_HEIGHT : 0;
    Animated.timing(this.state.height, {
        toValue,
      })
      .start();
  }
  render(): React.Element {
    if (!this.props.error) return null;
    const { height } = this.state;
    return (
      <Animated.View style={[styles.container, { height }]}>
        <Text style={styles.text}>Network request failed</Text>
      </Animated.View>
    );
  }
}

Error.propTypes = {
  error: PropTypes.object,
};

const FINAL_HEIGHT = 50;
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width,
    height: 0,
    backgroundColor: '#212121',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  text: {
    color: 'white',
  },
});

export default Error;
