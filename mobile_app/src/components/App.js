/* @flow */

import React, {Component} from 'react';
import {View, NavigationExperimental} from 'react-native';
import { Provider } from 'react-redux';
import store from '../redux/configureStore';
import {pushRoute} from '../redux/actions/router';

import Router from './Router';
import DrawerMenu from './commons/drawerMenu/DrawerMenu';

const {
  StateUtils: NavigationStateUtils,
} = NavigationExperimental;

class App extends Component {
  state = {
  };

  componentDidMount() {
    store.dispatch(pushRoute({key: 'login'}));
  }

  drawerRef = null;
  _openDrawer = () => {
    if (!this.drawerRef) return;
    this.drawerRef.open();
  }

  render(): any {
    console.log(store);
    return (
      <Provider store={store}>
        <View style={{flex: 1}}>
          <Router openDrawer={this._openDrawer} />
          <DrawerMenu ref={ref => { this.drawerRef = ref; }}
            pushRoute={(route) => { store.dispatch(pushRoute(route)); }} />
        </View>
      </Provider>
    );
  }
}
export default App;
