/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { disconnect } from '../../../redux/actions/user';
import Badge from './Badge';
import ProfilePic from '../ProfilePic';

const { width, height } = Dimensions.get('window');

const DRAWER_WIDTH = width / 5 * 4;

type DrawerMenuPropsType = {};

class DrawerMenu extends Component {
  constructor(props: DrawerMenuPropsType) {
    super(props);
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) =>
        gestureState.dx !== 0 && gestureState.dy !== 0,
      onPanResponderMove: (evt, gestureState) => {
        this._onPanResponderMove(evt, gestureState);
      },
      onPanResponderRelease: (evt, gestureState) => {
        this._onPanResponderRelease(evt, gestureState);
      },
    });
  }
  state = {
    drawerRight: new Animated.Value(-DRAWER_WIDTH),
    isOpen: false,
  };
  _panResponder: PanResponder;

  _onPanResponderMove(evt, gestureState) {
    const { dx } = gestureState;
    if (dx <= -2) {
      this.state.drawerRight.setValue(dx);
    }
  }
  _onPanResponderRelease(evt, gestureState) {
    const { dx } = gestureState;
    const limit = -(DRAWER_WIDTH / 3 * 2);
    if (dx <= limit) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.setState({ isOpen: true });
    Animated.timing(this.state.drawerRight, { toValue: 0 }).start();
  }

  close() {
    Animated.timing(this.state.drawerRight, { toValue: -DRAWER_WIDTH }).start(() => {
      this.setState({ isOpen: false });
    });
  }

  _renderLoginItem() {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          this.close();
          this.props.pushRoute({ key: 'login' });
        }}>
        <Icon name='account-circle' style={styles.icon} size={20} color='white' />
        <Text style={styles.label}>Login</Text>
      </TouchableOpacity>
    );
  }

  _renderDisconnectItem() {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          this.props.disconnect();
        }}>
        <Icon name='account-circle' style={styles.icon} size={20} color='white' />
        <Text style={styles.label}>Logout</Text>
      </TouchableOpacity>
    );
  }

  componentDidMount() {
    if (this.props.onRef) {
      this.props.onRef(this);
    }
  }
  componentWillUnmount() {
    if (this.props.onRef) {
      this.props.onRef(null);
    }
  }

  render(): ?Object {
    if (!this.state.isOpen) return null;
    return (
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.drawer,
            {
              transform: [{ translateX: this.state.drawerRight }],
            },
          ]}
          {...this._panResponder.panHandlers}>
          <TouchableOpacity
            style={styles.userContainer}
            onPress={() => {
              this.close();
              this.props.pushRoute({ key: 'myProfile' });
            }}>
            <ProfilePic style={styles.userPic} size={110} username={this.props.username} />
            <Text style={styles.username}>{this.props.username}</Text>
          </TouchableOpacity>
          <View style={styles.mainMenu}>
            <View style={styles.menuItems}>
              <TouchableOpacity style={styles.item}>
                <Text style={styles.label}>My tasks</Text>
                <Badge value={5} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.footer}>
            <View style={styles.menuItems}>
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  this.close();
                  this.props.pushRoute({ key: 'settings' });
                }}>
                <Icon name='settings' style={styles.icon} size={20} color='white' />
                <Text style={styles.label}>Settings</Text>
              </TouchableOpacity>
              {this.props.token ? this._renderDisconnectItem() : this._renderLoginItem()}
            </View>
          </View>
        </Animated.View>
        <TouchableWithoutFeedback
          onPress={() => {
            this.close();
          }}>
          <View style={styles.closeOverlay} />
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    elevation: 4,
  },
  drawer: {
    height,
    width: DRAWER_WIDTH,
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#263238',
    elevation: 5,
  },
  userContainer: {
    width: DRAWER_WIDTH,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  userPic: {
    marginTop: 5,
    marginBottom: 5,
  },
  username: {
    color: 'white',
    fontSize: 20,
  },
  closeOverlay: {
    height,
    width: width - DRAWER_WIDTH,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  menuItems: {},
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    width: DRAWER_WIDTH,
    marginLeft: 15,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    marginTop: 5,
    marginBottom: 5,
    fontSize: 18,
    color: 'white',
  },
  mainMenu: {
    flex: 0.8,
  },
  footer: {
    flex: 0.3,
  },
});
const mapStateToProps = state => {
  return {
    ...state.user,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    disconnect: () => {
      dispatch(disconnect());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DrawerMenu);
