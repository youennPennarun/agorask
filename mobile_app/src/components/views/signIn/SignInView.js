/* @flow */

import React, { Component, PropTypes } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { MKButton, MKTextField, MKColor } from 'react-native-material-kit';

import { doSignIn, cleanErrors } from '../../../redux/actions/user';
import ProfilePicturePicker from '../../../utils/ProfilePicturePicker';
import ProfilePic from '../../commons/ProfilePic';

const { width, height } = Dimensions.get('window');


type PropsType = {
  token: ?string,
  navigator: {
    back: Function,
  },
  doSignIn: Function,
  message: ?string,
};
type StateType = {
  username: string,
  email: string,
  password: string,
  confirmPassword: string,
  picture: {uri: ?String},
};

export class LoginView extends Component {
  static propTypes = {
    token: PropTypes.string,
    navigator: PropTypes.shape({
      back: PropTypes.func.isRequired,
    }).isRequired,
    doSignIn: PropTypes.func.isRequired,
    message: PropTypes.string,
  };
  state: StateType = {
    username: 'john',
    email: 'john@email.com',
    password: 'password',
    confirmPassword: 'password',
    picture: {},
  };
  props: PropsType;

  /* eslint-disable react/sort-comp */
  usernameRef: ?Textfield = null;
  emailRef: ?Textfield = null;
  passwordRef: ?Textfield = null;
  confirmPasswordRef: ?Textfield = null;
  /* eslint-enable react/sort-comp */

  isFormValid(): boolean {
    return this.state.username !== '' && this.state.password !== '';
  }

  componentWillMount() {
    this.props.cleanErrors();
  }
  componentWillReceiveProps(nextProps: PropsType) {
    if (!this.props.token && nextProps.token) {
      this.props.navigator.back();
    }
  }

  _focusOnMissingField(): boolean {
    const { username, email, password, confirmPassword } = this.state;
    if (!username && this.usernameRef) {
      this.usernameRef.focus();
      return true;
    } else if (!email && this.emailRef) {
      this.emailRef.focus();
      return true;
    } else if (!password && this.passwordRef) {
      this.passwordRef.focus();
      return true;
    } else if (!confirmPassword && this.confirmPasswordRef) {
      this.confirmPasswordRef.focus();
      return true;
    } else if (password !== confirmPassword && this.confirmPasswordRef) {
      this.confirmPasswordRef.focus();
      return true;
    }
    return false;
  }

  showPicker() {
    ProfilePicturePicker()
      .then((pic) => {
        this.setState({picture: pic});
      });
  }

  _onSubmit() {
    const { username, email, password, picture } = this.state;
    if (!this._focusOnMissingField()) {
      this.props.doSignIn(username, email, password, picture);
    }
  }

  _renderErrorMessage(): ?Object {
    const { message } = this.props;
    if (message) {
      return <Text style={styles.errorMessage}>{message}</Text>;
    }
    return null;
  }

  _renderLoadingViewIfNeeded() {
    if (!this.props.isFetching) return null;
    return (
      <View style={styles.loadingView} >
        <View style={styles.loadingViewBackground} />
        <ActivityIndicator size='large' />
      </View>
    );
  }

  render(): Object {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => { this.showPicker(); }} >
          <ProfilePic style={styles.userPic} size={110} src={this.state.picture.uri} />
        </TouchableOpacity>
        {this._renderErrorMessage()}
        
      <KeyboardAvoidingView behavior='position' >
        <Textfield
          ref={r => {
            this.usernameRef = r;
          }}
          style={styles.textInput}
          placeholder='Username'
          blurOnSubmit
          onSubmitEditing={() => {
            this._onSubmit();
          }}
          value={this.state.username}
          onChangeText={(text: string) => {
            this.setState({ username: text });
          }} />
        <Textfield
          ref={r => {
            this.emailRef = r;
          }}
          style={styles.textInput}
          keyboardType="email-address"
          placeholder='Email'
          blurOnSubmit
          onSubmitEditing={() => {
            this._onSubmit();
          }}
          value={this.state.email}
          onChangeText={(text: string) => {
            this.setState({ email: text });
          }} />
        <Textfield
          ref={r => {
            this.passwordRef = r;
          }}
          style={styles.textInput}
          placeholder='Password'
          secureTextEntry
          blurOnSubmit
          selectTextOnFocus
          password
          onSubmitEditing={() => {
            this._onSubmit();
          }}
          value={this.state.password}
          onChangeText={(text: string) => {
            this.setState({ password: text });
          }} />
        <Textfield
          ref={r => {
            this.confirmPasswordRef = r;
          }}
          style={styles.textInput}
          placeholder='Confirm password'
          secureTextEntry
          blurOnSubmit
          selectTextOnFocus
          password
          onSubmitEditing={() => {
            this._onSubmit();
          }}
          value={this.state.confirmPassword}
          onChangeText={(text: string) => {
            this.setState({ confirmPassword: text });
          }} />
          </KeyboardAvoidingView>

        <RegisterButton
          enabled={this.isFormValid()}
          onPress={() => {
            this._onSubmit();
          }} />

        <TouchableOpacity
          style={styles.goToMapButton}
          onPress={() => {
            this.props.navigator.back();
          }}>
          <Text>Cancel</Text>
        </TouchableOpacity>
        { this._renderLoadingViewIfNeeded() }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
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
  loadingView: {
    ...StyleSheet.absoluteFillObject,
    elevation: 99,
    justifyContent: 'center',
  },
  loadingViewBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    opacity: 0.5,
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

const mapStateToProps = state => {
 return ({
  ...state.user,
});
};

const mapDispatchToProps = dispatch => {
 return ({
  doSignIn: (username: string, email: string, password: string, image: ?String) => {
    return dispatch(doSignIn(username, email, password, image));
  },
  cleanErrors: () => dispatch(cleanErrors()),
});
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginView);
