import React, {Component} from 'react';
import {View, Animated, TouchableOpacity} from 'react-native';
import SVG, {Circle} from 'react-native-svg';
import AnimatedImplementation from 'AnimatedImplementation';

const AnimatedSVG = {
  Circle: AnimatedImplementation.createAnimatedComponent(Circle),
};

class SvgAnimationTest extends Component {
  state = {
    radius: new Animated.Value(45),
  }
  animate() {
    Animated.timing(this.state.radius, {
      toValue: 20,
      duration: 2000,
    }).start(() => {
      Animated.timing(this.state.radius, {
      toValue: 45,
      duration: 2000,
    }).start()
    });
  }
  interpolateToString(value: Animated.Value, range: number[]) {
    const outputRange = [`${range[0]}`, `${range[1]}`];
    return value.interpolate({
      inputRange: range,
      outputRange,
    });
  }

  render() {
    return (
      <View>
        <SVG height='100' width='100' >
          <AnimatedSVG.Circle cx='50' cy='50' r={this.interpolateToString(this.state.radius, [20, 45])} fill='green' />
        </SVG>
        
        <TouchableOpacity style={{
            width: 50,
            height: 50,
            backgroundColor: 'blue',
          }}
          onPress={() => { this.animate(); }} />
      </View>
    );
  }
}

export default SvgAnimationTest;
