/* @flow */

import React, {Component, PropTypes} from 'react';
import { View, NavigationExperimental, BackAndroid } from 'react-native';
import { connect } from 'react-redux';
import {popRoute} from '../redux/actions/router';

const {
  CardStack: NavigationCardStack,
} = NavigationExperimental;

import Map from './views/map/MapView';
import LoginView from './views/login/LoginView';
import VenueDetails from './views/venueDetails/VenueDetails';
import TaskDetails from './views/taskDetails/TaskDetails';

export class Router extends Component {
  static routes = {
    map: {
      component: Map,
    },
    login: {
      component: LoginView,
    },
    venueDetails: {
      component: VenueDetails,
    },
    taskDetails: {
      component: TaskDetails,
    },
  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', () => {
      if (this.props.navigator.routes.length > 1) {
        this.props.back();
        return true;
      }
      return false;
    });
  }

  _renderScene({ scene }): Object {
    const routeConfig = Router.routes[scene.route.key];
    if (routeConfig) {
      return React.createElement(routeConfig.component, {
        ...scene.route,
        openDrawer: this.props.openDrawer,
      });
    }
    return <View />;
  }

  render() {
    const {navigator} = this.props;
    return (
      <NavigationCardStack style={{flex: 1}}
        onNavigateBack={() => { this._onPopRoute(); }}
        navigationState={navigator}
        renderScene={(sceneProps) => this._renderScene(sceneProps)} />
    );
  }
}
Router.propTypes = {
  openDrawer: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  navigator: state.navigator,
});
const mapDispatchToProps = (dispatch) => ({
  back: () => { dispatch(popRoute()); },
});



export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Router);
