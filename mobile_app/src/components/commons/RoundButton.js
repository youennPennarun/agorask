import React, {Component, PropTypes} from 'react';
import {View, TouchableOpacity, Animated, BackAndroid} from 'react-native';


class RoundButton extends Component {

  state = {
    scale: new Animated.Value(0),
    active: false,
  }

  componentDidMount() {
    this.scaleUp();
    BackAndroid.addEventListener('hardwareBackPress', this._handleBackButton);
  }
  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this._handleBackButton);
  }
  _handleBackButton = () => {
    if (this.state.active) {
      this.switch();
      return true;
    }
    return false;
  }

  scaleUp() {
    console.log('scale up');
    return new Promise(resolve => {
      Animated.timing(this.state.scale, {
        toValue: 1,
        duration: 200,
      }).start(resolve);
    });
  }
  scaleDown() {
    return new Promise(resolve => {
      Animated.timing(this.state.scale, {
        toValue: 0,
        duration: 200,
      }).start(resolve);
    });
  }

  switch() {
    const {initialState, activatedState} = this.props;
    const {active} = this.state;
    this.scaleDown()
      .then(() => {
        const stateToRender = (active) ? activatedState : initialState;
        if (stateToRender && stateToRender.callback) stateToRender.callback();
        this.setState({active: !active});
        this.scaleUp();
      });
  }

  render() {
    const {scale, active} = this.state;
    const {size, initialState, activatedState} = this.props;

    const stateToRender = active ? activatedState : initialState;

    return (
        <Animated.View style={[
          this.props.style,
          {width: size, height: size, borderRadius: size / 2, backgroundColor: stateToRender.color},
          {
            transform: [
              {scale},
              {
                rotate: scale.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          }]} >

      <TouchableOpacity style={{width: size, height: size, justifyContent: 'center', alignItems: 'center'}} onPress={() => { this.switch(); }}>
        {stateToRender.renderIcon()}
      </TouchableOpacity>
      </Animated.View>
    );
  }
}

RoundButton.defaultProps = {
  style: {},
  size: 50,
  initialState: {
    color: 'red',
    renderIcon: () => null,
  },
  activatedState: {
    color: 'blue',
    renderIcon: () => null,
  },
};


export default RoundButton;
