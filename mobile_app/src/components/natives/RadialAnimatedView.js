/* @flow */

import React, {Component, PropTypes} from 'react';
import {View, requireNativeComponent} from 'react-native';


// eslint-disable-next-line react/prefer-es6-class
class RadialAnimatedViewWrapper extends Component {
  state = {
    revealed: false,
  }

  toogle() {
    this.setState(prevState => ({
      revealed: !prevState.revealed,
    }));
  }

  reveal() {
    this.setState({
      revealed: true,
    });
  }
  hide() {
    this.setState({
      revealed: false,
    });
  }

  render(): Object {
    const props = {
      ...this.props,
      revealed: this.state.revealed,
    };
    return (
      <RadialAnimatedView {...props} />
    );
  }
}

RadialAnimatedViewWrapper.propTypes = {
  ...View.propTypes,
  revealed: PropTypes.bool,
  center: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),
};


const RadialAnimatedView = requireNativeComponent('RadialAnimatedView', RadialAnimatedViewWrapper, {
  nativeOnly: {
    revealed: true,
  },
});



module.exports = RadialAnimatedViewWrapper;
