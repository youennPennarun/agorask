/* @flow */

import React, {Component, PropTypes} from 'react';
import { View, NavigationExperimental, BackAndroid } from 'react-native';
import { connect } from 'react-redux';
import {popRoute, pushRoute} from '../redux/actions/router';

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
      navigator: dispatch => ({
        back: () => dispatch(popRoute()),
      }),
    },
    venueDetails: {
      component: VenueDetails,
      navigator: dispatch => ({
        taskDetails: (id, initialData) => dispatch(pushRoute({key: 'taskDetails', id, task: initialData })),
      }),
    },
    taskDetails: {
      component: TaskDetails,
    },
  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', () => {
      if (this.props.navigator.routes.length > 1) {
        this.props.dispatch(popRoute());
        return true;
      }
      return false;
    });
  }

  createNextScene(scene, routeConfig = {}) {
    const props = {
      ...scene.route,
      openDrawer: this.props.openDrawer,
      navigator: {},
    }
    if (routeConfig.navigator) {
      props.navigator = routeConfig.navigator(this.props.dispatch);
    }
    console.log(props);
    return React.createElement(routeConfig.component, props);
  }

  _renderScene({ scene }): Object {
    const routeConfig = Router.routes[scene.route.key];
    if (routeConfig) {
      return this.createNextScene(scene, routeConfig);
    }
    return <View />;
  }

  render() {
    const {navigator} = this.props;
    return (
      <NavigationCardStack style={{flex: 1}}
        onNavigateBack={() => { this.props.dispatch(popRoute()); }}
        navigationState={navigator}
        renderScene={(sceneProps) => this._renderScene(sceneProps)} />
    );
  }
}
Router.propTypes = {
  openDrawer: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {navigator: state.navigator};
};



export default connect(
  mapStateToProps,
)(Router);
