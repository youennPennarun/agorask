/* @flow */

import React, {Component, PropTypes} from 'react';
import { View, Animated, NavigationExperimental, BackAndroid } from 'react-native';
import { connect } from 'react-redux';
import {popRoute, pushRoute, transitionStart, transitionEnd} from '../redux/actions/router';
import Transitions from '../utils/Transitions';

const {
  Card: NavigationCard,
  Transitioner: NavigationTransitioner,
} = NavigationExperimental;

const {
  PagerStyleInterpolator: NavigationPagerStyleInterpolator,
} = NavigationCard;

import Map from './views/map/MapView';
import LoginView from './views/login/LoginView';
import SignInView from './views/signIn/SignInView';

import VenueDetails from './views/venueDetails/VenueDetails';
import TaskDetails from './views/taskDetails/TaskDetails';


export class Router extends Component {
  static routes = {
    map: {
      component: Map,
      transition: 'vertical',
    },
    login: {
      component: LoginView,
      navigator: (dispatch) : Object => ({
        back: () : Promise<*> => dispatch(popRoute()),
        signIn: () : Promise<*> => dispatch(pushRoute({key: 'signIn'})),
      }),
      transition: 'vertical',
    },
    signIn: {
      component: SignInView,
      navigator: (dispatch) : Object => ({
        back: () : Promise<*> => dispatch(popRoute()),
      }),
    },
    venueDetails: {
      component: VenueDetails,
      navigator: (dispatch) : Object => ({
        taskDetails: (id, initialData, position) : Promise<*> =>
          dispatch(pushRoute({key: 'taskDetails', id, task: initialData, position })),
      }),
      transition: 'none',
    },
    taskDetails: {
      component: TaskDetails,
      transition: 'focus',
    },
  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', (): boolean => {
      if (this.props.navigator.routes.length > 1) {
        this.props.dispatch(popRoute());
        return true;
      }
      return false;
    });
  }

  getTransition(routeConfig: Object, config: Object): Object {
    if (!routeConfig.transition || routeConfig.transition === 'horizontal') {
      return NavigationPagerStyleInterpolator.forHorizontal(config);
    } else if (routeConfig.transition === 'vertical') {
      return Transitions.forVertical(config);
    } else if (routeConfig.transition === 'focus') {
      return Transitions.focus(config);
    } else if (typeof routeConfig.transition === 'function') {
      return routeConfig.transition(config);
    }
    return {};
  }

  createNextScene({scene, ...transitionProps}: Object, routeConfig: Object = {}): React.Element<*> {
    const props = {
      ...scene.route,
      openDrawer: this.props.openDrawer,
      isActive: scene.isActive,
      navigator: {},
    };
    if (routeConfig.navigator) {
      props.navigator = routeConfig.navigator(this.props.dispatch);
    }
    return React.createElement(routeConfig.component, props);
  }

  _render(transitionProps): Array<React.Element<any>> {
    return transitionProps.scenes.map((scene, key) : React.Element<*> => {
      const sceneProps = {
        ...transitionProps,
        scene,
      };
      return this._renderScene(sceneProps, key);
    });
  }

  _renderScene(props, key): Object {
    const routeConfig = Router.routes[props.scene.route.key];
    const style = [
      {
        flex: 1,
        bottom: 0,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
      },
      this.getTransition(routeConfig, props),
    ];
    if (routeConfig) {
      return (
        <Animated.View key={key} style={style}>
          { this.createNextScene(props, routeConfig) }
        </Animated.View>
      );
    }
    return <View />;
  }

  render(): React.Element<Router> {
    const {navigator} = this.props;
    return (
      <NavigationTransitioner navigationState={navigator}
        onTransitionStart={() => this.props.dispatch(transitionStart())}
        onTransitionEnd={() => this.props.dispatch(transitionEnd())}
        render={(transitionProps): Array<React.Element<*>> =>
          this._render(transitionProps)
        } />
    );
  }

}
Router.propTypes = {
  openDrawer: PropTypes.func.isRequired,
};

const mapStateToProps = (state): {navigator: Function} => {
  return {navigator: state.navigator};
};

export default connect(
  mapStateToProps,
)(Router);
