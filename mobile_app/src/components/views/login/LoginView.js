/* @flow */

import React, {Component} from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import {MKButton, MKTextField, MKColor} from 'react-native-material-kit';

import {login} from '../../../redux/actions/user';
import {popRoute} from '../../../redux/actions/router';


const {width} = Dimensions.get('window');

type LoginViewStateType = {
  username: string,
  password: string,
}

type LoginViewPropsType = {
  navigator: {
    back: Function,
    signIn: Function,
  },
  doLogin: Function,
  message: ?string,
  token: ?string,
}

export class LoginView extends Component {
  state: LoginViewStateType = {
    username: '',
    password: '',
  }
  props: LoginViewPropsType;

  /* eslint-disable react/sort-comp */
  usernameRef: MKTextField = null;
  passwordRef: MKTextField = null;
  /* eslint-enable react/sort-comp */

  login() {
    const {username, password} = this.state;
    const {doLogin} = this.props;
    if (username && password) {
      doLogin(username, password);
    }
  }

  setUsernameRef = (r: MKTextField) => { this.usernameRef = r; }
  setPasswordRef = (r: MKTextField) => { this.passwordRef = r; }

  isFormValid(): boolean {
    return (
      this.state.username !== '' &&
      this.state.password !== ''
    );
  }

  _onSubmitUsername() {
    if (this.passwordRef) {
      this.passwordRef.focus();
    }
  }

  componentWillReceiveProps(nextProps: LoginViewPropsType) {
    if (!this.props.token && nextProps.token) {
      this.props.navigator.back();
    }
  }

  _onSubmitPassword() {
    const {username, password} = this.state;
    if (!username && this.usernameRef) {
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
        <Text style={styles.errorMessage}
          accessibilityLabel='Error Message'>
          {message}
        </Text>
      );
    }
    return null;
  }

  render(): Object {
    return (
      <View style={styles.container} accessibilityLabel='Login View'>
        <Image style={styles.logo}
          source={require('../../../assets/logo.png')}
          resizeMode='contain' />
        {this._renderErrorMessage()}
        <Textfield ref={this.setUsernameRef}
          accessibilityLabel='Username Input'
          style={styles.textInput}
          placeholder='Username'
          blurOnSubmit
          onSubmitEditing={() => { this._onSubmitUsername(); }}
          value={this.state.username}
          onChangeText={(text: string) => { this.setState({username: text}); }} />
        <Textfield ref={this.setPasswordRef}
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

          <RegisterButton onPress={() => { this.props.navigator.signIn(); }} />

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
    backgroundColor: 'white',
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


const mapStateToProps = (state: Object): Object => ({
  ...state.user,
});

const mapDispatchToProps = (dispatch): Object => ({
  doLogin: (username: string, password: string) => {
    dispatch(login(username, password));
  },
  goToMap: (): null => dispatch(popRoute()),
});


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginView);
