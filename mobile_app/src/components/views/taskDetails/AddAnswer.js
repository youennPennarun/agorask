/* @flow */

import React, {Component, PropTypes} from 'react';

import {connect} from 'react-redux';

import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {MKButton, MKTextField} from 'react-native-material-kit';

const { wHeight, wWidth } = Dimensions.get('window');

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
    if (this.state.answerHeight !== height) {
      this.setState({answerHeight: height});
    }
  }


  submit() {
    const {answer} = this.state;
    this.setState({loading: true, answer: ''});
    this.props.addAnswer({answer: answer})
      .then(() => { this.setState({loading: false, answer: ''}); })
      .catch(e => {
        console.log('error ', e);
        this.setState({loading: false, answer});
      });
  }

  _renderNotLoggedin(): React.Element {
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
    paddingHorizontal: 30,
    paddingVertical: 10,
    paddingBottom: 25,
    height: 100,
    backgroundColor: 'white',
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


export default AddAnswer;
