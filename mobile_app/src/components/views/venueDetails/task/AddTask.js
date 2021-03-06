/* @flow */

import React, {Component} from 'react';
import {View, Text, StyleSheet, Dimensions, Animated} from 'react-native';
import {MKButton, MKTextField} from 'react-native-material-kit';

const {width, height} = Dimensions.get('window');

type AddTaskStateType = {
  overlayOpacity: Animated.Value,
  containerTop: Animated.Value,
  answerHeight: number,
  title: string,
};
type AddTaskPropsType = {
  visible: boolean,
  loading: boolean,
  addTask: Function,
  onClose: Function,
};

class AddTask extends Component {
  static defaultProps = {
    addTask: () => {},
    onClose: () => {},
  };

  state: AddTaskStateType = {
    title: '',
    overlayOpacity: new Animated.Value(0),
    containerTop: new Animated.Value(height),
    answerHeight: 35,
  }
  props: AddTaskPropsType;
  componentWillReceiveProps(nextProps: AddTaskPropsType) {
    if (this.props.visible !== nextProps.visible) {
      if (nextProps.visible) {
        this.show();
      } else {
        this.close();
      }
    }
  }
  show() {
    Animated.parallel([
      Animated.timing(this.state.overlayOpacity, {
        toValue: 1,
        duration: 250,
      }),
      Animated.timing(this.state.containerTop, {
        toValue: 0,
        duration: 350,
      }),
    ]).start();
  }
  close() {
    Animated.parallel([
      Animated.timing(this.state.overlayOpacity, {
        toValue: 0,
        duration: 250,
      }),
      Animated.timing(this.state.containerTop, {
        toValue: height,
        duration: 250,
      }),
    ]).start();
  }

  updateFieldHeight({height: newHeight}) {
    if (this.state.answerHeight !== newHeight) {
      this.setState({answerHeight: newHeight});
    }
  }
  submit() {
    const {title} = this.state;
    this.props.addTask({title})
      .then(() => {
        this.setState({title: ''});
        this.close();
        this.props.onClose();
      }).catch(e => console.log(e));
  }

  render(): React.Element<AddTask> {
    const containerStyle = this.props.style || {};
    const animatedOverlayStyle = {opacity: this.state.overlayOpacity};
    const contentAnimation = {top: this.state.containerTop};
    return (
      <View style={[styles.container, containerStyle]}
        pointerEvents={(this.props.visible) ? 'auto' : 'none'}>
        <Animated.View style={[styles.overlay, animatedOverlayStyle]} />
        <Animated.View style={[styles.content, contentAnimation]} >
          <Text style={styles.title}>Add a task</Text>
          {(this.props.isLoggedIn) ? (
            <View>
              <MKTextField style={[
                  styles.answerInput,
                  {height: Math.max(35, this.state.answerHeight)},
                ]}
                multiline
                value={this.state.title}
                onTextChange={text => { this.setState({title: text}); }}
                onChange={({nativeEvent: {contentSize}}) => {
                  this.updateFieldHeight(contentSize);
                }}
                onContentSizeChange={({nativeEvent: {contentSize}}) => {
                  this.updateFieldHeight(contentSize);
                }}
                placeholder='task description' />

              <SubmitBtn enabled={this.props.loading}
                onPress={() => { this.submit(); }} />
            </View>
            ) : (
              <Text>You must be logged in to add a task</Text>
          )}
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    opacity: 0,
  },
  content: {
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    width,
    height: height,
    elevation: 12,
    paddingHorizontal: 10,
  },
  title: {
    color: 'black',
    fontSize: 24,
    marginBottom: 15,
  },
  button: {
    width: width * 0.5,
    marginTop: 10,
    alignSelf: 'center',
  },
  answerInput: {
    marginBottom: 15,
  },
});

const SubmitBtn = MKButton.coloredButton()
  .withText('Submit')
  .withStyle(styles.button)
  .build();

export default AddTask;
