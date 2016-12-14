/* @flow */

import React, {Component} from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import {MKButton, MKTextField, MKColor} from 'react-native-material-kit';

import {doSignIn} from '../../../redux/actions/user';


const {width} = Dimensions.get('window');

export class LoginView extends Component {
  state = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  }
  usernameRef = null;
  emailRef = null;
  passwordRef = null;
  confirmPasswordRef = null;

  isFormValid(): boolean {
    return (
      this.state.username !== '' &&
      this.state.password !== ''
    );
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.token && nextProps.token) {
      this.props.navigator.back();
    }
  }

  _focusOnMissingField() {
    const {username, email, password, confirmPassword} = this.state;
    console.log({username, email, password, confirmPassword})
    if (!username) {
      this.usernameRef.focus();
      return true;
    } else if (!email) {
      this.emailRef.focus();
      return true;
    } else if (!password) {
      this.passwordRef.focus();
      return true;
    } else if (!confirmPassword) {
      this.confirmPasswordRef.focus();
      return true;
    } else if (password !== confirmPassword) {
      this.confirmPasswordRef.focus();
      return true;
    }
    return false;
  }

  _onSubmit() {
    const {username, email, password} = this.state;
    if (!this._focusOnMissingField()) {
      this.props.doSignIn(username, email, password);
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
    return (
      <View style={styles.container}>
        <View style={styles.logo} />
          {this._renderErrorMessage()}
          <Textfield ref={r => { this.usernameRef = r; }}
            style={styles.textInput}
            placeholder='Username'
            blurOnSubmit
            onSubmitEditing={() => { this._onSubmit(); }}
            value={this.state.username}
            onChangeText={(text: string) => { this.setState({username: text}); }} />
          <Textfield ref={r => { this.emailRef = r; }}
            style={styles.textInput}
            placeholder='Email'
            blurOnSubmit
            onSubmitEditing={() => { this._onSubmit(); }}
            value={this.state.email}
            onChangeText={(text: string) => { this.setState({email: text}); }} />
          <Textfield ref={r => { this.passwordRef = r; }}
            style={styles.textInput}
            placeholder='Password'
            secureTextEntry
            blurOnSubmit
            selectTextOnFocus
            password
            onSubmitEditing={() => { this._onSubmit(); }}
            value={this.state.password}
            onChangeText={(text: string) => { this.setState({password: text}); }} />
          <Textfield ref={r => { this.confirmPasswordRef = r; }}
            style={styles.textInput}
            placeholder='Confirm password'
            secureTextEntry
            blurOnSubmit
            selectTextOnFocus
            password
            onSubmitEditing={() => { this._onSubmit(); }}
            value={this.state.confirmPassword}
            onChangeText={(text: string) => { this.setState({confirmPassword: text}); }} />

          <RegisterButton enabled={this.isFormValid()}
            onPress={() => { this._onSubmit(); }} />

          <TouchableOpacity style={styles.goToMapButton}
            onPress={() => { this.props.navigator.back(); }}>
            <Text>Cancel</Text>
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
  button: {
    marginVertical: 5,
  },
  goToMapButton: {
    marginTop: 10,
  },
});

const RegisterButton = MKButton.coloredButton()
  .withText('Sign in')
  .withStyle(styles.button)
  .build();

const Textfield = MKTextField.textfieldWithFloatingLabel()
  .withUnderlineEnabled(true)
  .withHighlightColor(MKColor.Green)
  .build();


const mapStateToProps = state => ({
  ...state.user,
});

const mapDispatchToProps = (dispatch) => ({
  doSignIn: (username: string, email: String, password: string) => {
    dispatch(doSignIn(username, email, password));
  },
});


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginView);
