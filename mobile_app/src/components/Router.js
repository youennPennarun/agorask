/* @flow */

import React, {Component} from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

import Map from './views/map/MapView';
import LoginView from './views/login/LoginView';

export class Router extends Component {
  static routes = {
    map: {
      component: Map,
    },
    login: {
      component: LoginView,
    },
  }

  _renderRoute(): Object {
    const {currentRoute} = this.props;
    const routeConfig = Router.routes[currentRoute.name];
    if (routeConfig) {
      return React.createElement(routeConfig.component, {
        ...currentRoute.props,
        openDrawer: this.props.openDrawer,
      });
    }
    return <View />;
  }

  render(): Object {
    return (
      <View style={{flex: 1}}>
        {this._renderRoute()}
      </View>
    );
  }
}
Router.propTypes = {};

const mapStateToProps = state => ({
  currentRoute: state.router.currentRoute,
});


export default connect(
  mapStateToProps,
)(Router);
