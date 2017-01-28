/* @flow */

import React, {Component, PropTypes} from 'react';

import {connect} from 'react-redux';
import {login} from '../../../redux/actions/router';

import {View, Text, StyleSheet} from 'react-native';
import {MKButton, MKTextField} from 'react-native-material-kit';

type AddAnswerStateType = {
  answerHeight: number,
  loading: boolean,
  answer: string,
};

type AddAnswerPropsType = {
  login: Function,
  addAnswer: Function,
  token: string,
};

export class AddAnswer extends Component {
  static propTypes = {
    login: PropTypes.func.isRequired,
    addAnswer: PropTypes.func.isRequired,
    token: PropTypes.string,
  }
  state: AddAnswerStateType = {
    answerHeight: 0,
    loading: false,
    answer: '',
  };

  props: AddAnswerPropsType;

  updateAnswerFieldHeight({height}) {
  // height: number
    if (this.state.answerHeight !== height) {
      this.setState({answerHeight: height});
    }
  }


  submit() {
    const {answer} = this.state;
    this.setState({loading: true});
    this.props.addAnswer({answer: answer}, this.props.token)
      .then(() => {
          this.setState({loading: false, answer: ''});
      })
      .catch(e => {
        console.log('error ', e);
        this.setState({loading: false});
      });
  }

  _renderNotLoggedin(): React.Element<*> {
    return (
      <View style={styles.notLoggedInContainer}>
        <Text>You need to be logged in to add an answer</Text>
        <LoginBtn onPress={() => { this.props.login(); }} />
      </View>
    );
  }

  render(): React.Element<*> {
    if (!this.props.token) return this._renderNotLoggedin();
    return (
      <View style={styles.container} >
        <MKTextField style={[styles.answerInput, {height: Math.max(35, this.state.answerHeight)}]}
          multiline
          value={this.state.answer}
          onTextChange={text => { this.setState({answer: text}); }}
          onChange={({nativeEvent: {contentSize}}) => {
            this.updateAnswerFieldHeight(contentSize);
          }}
          onContentSizeChange={({nativeEvent: {contentSize}}) => {
            this.updateAnswerFieldHeight(contentSize);
          }}
          placeholder='answer' />

        <AddAnswerBtn enabled={!this.state.loading} onPress={() => { this.submit(); }} />
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 30,
    paddingVertical: 10,
    marginBottom: 25,
  },
  answerInput: {
  },
  button: {
    alignSelf: 'center',
    width: 150,
    marginVertical: 10,
  },
  notLoggedInContainer: {
    alignItems: 'center',
  },
});

const AddAnswerBtn = MKButton.coloredButton()
  .withText('Add an answer')
  .withStyle(styles.button)
  .build();
const LoginBtn = MKButton.coloredButton()
  .withText('Login')
  .withStyle(styles.button)
  .build();

function mapStateToProps(state): Object {
  return {
    ...state.user,
  };
}
function mapDispatchToProps(dispatch): Object {
  return {
    login: () => { dispatch(login()); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddAnswer);
