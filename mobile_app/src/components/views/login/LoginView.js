/* @flow */

import React, {Component} from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
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
    if (!this.props.token && nextProps.token) {
      this.props.navigator.back();
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
      <View style={styles.container} accessibilityLabel='Login View'>
        <Image style={styles.logo}
          source={require('../../../assets/logo.png')}
          resizeMode='contain' />
        {this._renderErrorMessage()}
        <Textfield ref={r => { this.usernameRef = r; }}
          accessibilityLabel='Username Input'
          style={styles.textInput}
          placeholder='Username'
          blurOnSubmit
          onSubmitEditing={() => { this._onSubmitUsername(); }}
          value={this.state.username}
          onChangeText={(text: string) => { this.setState({username: text}); }} />
        <Textfield ref={r => { this.passwordRef = r; }}
          accessibilityLabel='Password Input'
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

          <RegisterButton onPress={() => this.props.navigator.signIn()} />

          <TouchableOpacity accessibilityLabel='Skip login'
            style={styles.goToMapButton}
            onPress={() => { this.props.navigator.back(); }}>
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
  },
  errorMessage: {
    color: 'red',
  },
  textInput: {
    height: 45,
    width: width - 100,
    marginBottom: 15,
  },
  button: {
    marginVertical: 5,
  },
  goToMapButton: {
    marginTop: 10,
  },
});
const LoginButton = MKButton.coloredButton()
  .withText('Login')
  .withStyle(styles.button)
  .build();

const RegisterButton = MKButton.coloredButton()
  .withText('Sign in')
  .withStyle(styles.button)
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
