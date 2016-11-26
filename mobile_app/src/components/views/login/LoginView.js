/* @flow */

import React, {Component} from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import {MKButton, MKTextField, MKColor} from 'react-native-material-kit';

import {login} from '../../../redux/actions/user';
import {popRoute} from '../../../redux/actions/router';


const {width} = Dimensions.get('window');

export class LoginView extends Component {
  state = {
    username: '',
    password: '',
  }
  usernameRef = null;
  passwordRef = null;
  login() {
    const {username, password} = this.state;
    const {doLogin} = this.props;
    if (username && password) {
      doLogin(username, password);
    }
  }

  isFormValid(): boolean {
    return (
      this.state.username !== '' &&
      this.state.password !== ''
    );
  }

  _onSubmitUsername() {
    this.passwordRef.focus();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.token) {
      this.props.goToMap();
    }
  }

  _onSubmitPassword() {
    const {username, password} = this.state;
    if (!username) {
      this.usernameRef.focus();
      return;
    }
    if (password) {
      this.props.doLogin(username, password);
    }
  }

  _renderErrorMessage(): ?Object {
    const {message} = this.props;
    if (message) {
      return (
        <Text style={styles.errorMessage}>{message}</Text>
      );
    }
    return null;
  }

  render(): Object {
    const {goToMap} = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.logo} />
          {this._renderErrorMessage()}
          <Textfield ref={r => { this.usernameRef = r; }}
            style={styles.textInput}
            placeholder='Username'
            blurOnSubmit
            onSubmitEditing={() => { this._onSubmitUsername(); }}
            value={this.state.username}
            onChangeText={(text: string) => { this.setState({username: text}); }} />
          <Textfield ref={r => { this.passwordRef = r; }}
            style={styles.textInput}
            placeholder='Password'
            secureTextEntry
            blurOnSubmit
            selectTextOnFocus
            password
            onSubmitEditing={() => { this._onSubmitPassword(); }}
            value={this.state.password}
            onChangeText={(text: string) => { this.setState({password: text}); }} />

          <LoginButton enabled={this.isFormValid()}
            onPress={() => { this.login(); }} />

          <TouchableOpacity style={styles.goToMapButton}
            onPress={() => { goToMap(); }}>
            <Text>Not Now</Text>
          </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    marginTop: 15,
    width: width - 200,
    height: 150,
    backgroundColor: 'red',
  },
  errorMessage: {
    color: 'red',
  },
  textInput: {
    height: 45,
    width: width - 100,
    marginBottom: 15,
  },
  goToMapButton: {
    marginTop: 10,
  },
});
const LoginButton = MKButton.coloredButton()
  .withText('Login')
  .build();

const Textfield = MKTextField.textfieldWithFloatingLabel()
  .withPlaceholder('Search')
  .withUnderlineEnabled(true)
  .withHighlightColor(MKColor.Lime)
  .build();


const mapStateToProps = state => ({
  ...state.user,
});

const mapDispatchToProps = (dispatch) => ({
  doLogin: (username: string, password: string) => {
    dispatch(login(username, password));
  },
  goToMap: (): null => dispatch(popRoute()),
});


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginView);
