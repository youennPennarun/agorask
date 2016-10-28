/* @flow */

import React, {Component} from 'react';
import {View} from 'react-native';
import { Provider } from 'react-redux';
import store from '../redux/configureStore';
import {pushRoute} from '../redux/actions/router';

import Router from './Router';
import DrawerMenu from './commons/drawerMenu/DrawerMenu';


class App extends Component {
  state = {showMenu: false};

  componentDidMount() {
    store.dispatch(pushRoute('login'));
  }

  drawerRef = null;

  render(): any {
    return (
      <Provider store={store}>
        <View style={{flex: 1}}>
          <Router openDrawer={() => { this.drawerRef && this.drawerRef.open(); }} />
          <DrawerMenu ref={ref => { this.drawerRef = ref; }} />
        </View>
      </Provider>
    );
  }
}
export default App;
