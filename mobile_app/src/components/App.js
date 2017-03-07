/* @flow */
import React, { Component } from 'react';

import { View, PermissionsAndroid, UIManager, AsyncStorage } from 'react-native';

import { persistStore } from 'redux-persist';

import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';

import Config from 'react-native-config';

import configureStore from '../redux/configureStore';
import { pushRoute } from '../redux/actions/router';

import { loadTokenFromStorage } from '../redux/actions/user';
import TaskChecker from './natives/TaskChecker';

import { checkForUpdate, showUpdateModal } from '../utils/Version';

import Router from './Router';
import DrawerMenu from './commons/drawerMenu/DrawerMenu';

const clientQL = new ApolloClient({
  networkInterface: createNetworkInterface({ uri: `${Config.API_URL}/graphql` }),
});
const store = configureStore(clientQL);

class Wrapper extends Component {
  drawerRef = null;
  _openDrawer = () => {
    if (!this.drawerRef) return;
    this.drawerRef.open();
  };
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Router openDrawer={this._openDrawer} />
        <DrawerMenu
          onRef={ref => {
            this.drawerRef = ref;
          }}
          pushRoute={route => {
            store.dispatch(pushRoute(route));
          }} />
      </View>
    );
  }
}

class App extends Component {
  state = {
    ready: false,
  };

  componentWillMount() {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
    checkForUpdate().then(downloadUrl => {
      if (downloadUrl) {
        showUpdateModal(downloadUrl);
      }
    });
    this.init();
  }
  init() {
    persistStore(
      store,
      {
        storage: AsyncStorage,
        blacklist: ['search', 'navigator'],
      },
      () => {
        this.setState({ ready: true });
        if (!store.getState().user.token) {
          store.dispatch(pushRoute({ key: 'login' }));
        }
        if (store.getState().settings.notifications) {
          // TaskChecker.start();
        }
      },
    );
  }
  render(): any {
    return (
      <ApolloProvider store={store} client={clientQL}>
        {this.state.ready ? <Wrapper /> : <View />}
      </ApolloProvider>
    );
  }
}
export default App;
