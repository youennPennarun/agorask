import React, {Component, PropTypes} from 'react';
import {View, Text, StyleSheet, Dimensions, ScrollView, InteractionManager} from 'react-native';
import {
  MKProgress,
  MKSpinner,
} from 'react-native-material-kit';
import { connect } from 'react-redux';
import moment from 'moment';

import Vote from './Vote';

import {getTask} from '../../../redux/actions/task';

const {width} = Dimensions.get('window');

class TaskDetails extends Component {
  componentWillMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.getTask();
    });
  }
  _renderAnswer({answer, postedBy: {username}, date}, key): any {
    return (
      <View key={key} style={styles.answerContainer}>
        <View style={styles.row} >
          <Vote score={-5} />
          <View style={styles.answer} >
            <Text style={styles.answerText}>{answer}</Text>
            <View style={styles.answerFooter} >
              <Text style={styles.username} >{username}</Text>
              <Text style={styles.date} >{moment(date).format('DD/MM/YY')}</Text>
            </View>
          </View>
        </View>
        <View style={styles.separator} />
      </View>
    );
  }
  _renderProgressBar(): any {
    const {isFetching, answers = []} = this.props;
    if (!isFetching || !answers.length) return null;
    return <MKProgress.Indeterminate style={styles.progress} />;
  }
  _renderSpinner(): any {
    const {isFetching, answers = []} = this.props;
    if (!isFetching || answers.length) return null;
    return <MKSpinner style={styles.spinner} />;
  }
  render(): any {
    const {name, title, date, answers = []} = this.props;
    return (
      <View style={styles.container} >
        <View style={styles.header} >
          <Text>Arrow back</Text>
          <Text style={styles.venueName} >{name}</Text>
        </View>
        {this._renderProgressBar()}
        <ScrollView>
          <View style={styles.questionContainer} >
            <View style={styles.blockDate} >
              <Text>{moment(date).format('DD/MM/YY')}</Text>
            </View>
            <Text style={styles.question} >{title}</Text>
          </View>
          {this._renderSpinner()}
          <View style={[styles.answersContainer]} >
            {
              answers.map((answer: Object, key: number): any =>
                this._renderAnswer(answer, key)
              )
            }
          </View>
          <View style={styles.addAnswer} >
            <Text style={styles.addAnswerLabel}>Add an answer</Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  questionContainer: {
    width,
    backgroundColor: 'white',
    elevation: 6,
    marginBottom: 0,
    paddingBottom: 10,
    paddingLeft: 5,
  },
  header: {
    height: 50,
    backgroundColor: '#263238',
    alignItems: 'center',
    paddingLeft: 15,
    flexDirection: 'row',
  },
  venueName: {
    fontSize: 26,
    color: 'white',
  },
  blockDate: {
    width: width - 20,
    marginLeft: 10,
    alignItems: 'flex-end',
  },
  question: {
    fontSize: 23,
    marginLeft: 5,
  },
  answersContainer: {
    backgroundColor: 'white',
    marginBottom: 20,
  },
  answerContainer: {},
  row: {
    flexDirection: 'row',
  },
  answer: {
    marginTop: 4,
    marginLeft: 2,
    marginRight: 5,
    flexGrow: 1,
    flex: 1,
  },
  answerText: {
    fontSize: 16,
    color: 'black',
    flexGrow: 1,
  },
  answerFooter: {
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  username: {
    color: '#BDBDBD',
    fontSize: 15,
  },
  date: {
    color: '#BDBDBD',
  },
  separator: {
    width,
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  addAnswer: {
    width: 145,
    alignSelf: 'center',
    height: 50,
    backgroundColor: 'blue',
    justifyContent: 'center',
    marginBottom: 30,
  },
  addAnswerLabel: {
    textAlign: 'center',
    fontSize: 20,
  },
  progress: {

  },
  spinner: {
    alignSelf: 'center',
    marginTop: 50,
    marginBottom: 25,
  },
});

TaskDetails.propTypes = {
  id: PropTypes.string.isRequired,
};

const mapStateToProps = (state, props) => {
  const {name, isFetching, tasks} = state.selectedVenue.venue;
  return {
    name,
    isFetching,
    ...tasks.find(task => task._id === props.id),
  };
};

const mapDispatchToProps = (dispatch: Function, props): Object => ({
  getTask: () => {
    dispatch(getTask(props.id));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskDetails);
