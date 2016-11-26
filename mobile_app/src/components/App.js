/* @flow */

import React, {Component} from 'react';
import {View} from 'react-native';
import { Provider } from 'react-redux';
import store from '../redux/configureStore';
import {pushRoute} from '../redux/actions/router';
import {loadTokenFromStorage} from '../redux/actions/user';

import Router from './Router';
import DrawerMenu from './commons/drawerMenu/DrawerMenu';


class App extends Component {
  state = {
  };
  componentWillMount() {
    store.dispatch(loadTokenFromStorage());
  }
  componentDidMount() {
    if (!store.getState().user.token) {
      store.dispatch(pushRoute({key: 'login'}));
    }
  }

  drawerRef = null;
  _openDrawer = () => {
    if (!this.drawerRef) return;
    this.drawerRef.open();
  }

  render(): any {
    return (
      <Provider store={store}>
        <View style={{flex: 1}}>
          <Router openDrawer={this._openDrawer} />
          <DrawerMenu onRef={ref => { this.drawerRef = ref; }}
            pushRoute={(route) => { store.dispatch(pushRoute(route)); }} />
        </View>
      </Provider>
    );
  }
}
export default App;
