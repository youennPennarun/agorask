import React, {Component, PropTypes} from 'react';
import {View, Text, StyleSheet, Dimensions, ScrollView, InteractionManager} from 'react-native';
import {
  MKProgress,
  MKSpinner,
} from 'react-native-material-kit';
import update from 'immutability-helper';


import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';

import Vote from './Vote';
import AddAnswer from './AddAnswer';


const {width} = Dimensions.get('window');

export class TaskDetails extends Component {

  addAnswer(answer, token) {
    return this.props.addAnswer(this.props.task._id, answer, token);
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
    const {loading, task} = this.props;
    const {answers = []} = task;
    if (!loading || !answers.length) return null;
    return <MKProgress.Indeterminate style={styles.progress} />;
  }
  _renderSpinner(): any {
    const {loading, task} = this.props;
    const {answers = []} = task;
    if (!loading || answers.length) return null;
    return <MKSpinner style={styles.spinner} />;
  }
  render(): any {
    const {name, title, date, answers = []} = this.props.task;
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
                this._renderAnswer(answer, key),
              )
            }
          </View>
          <AddAnswer addAnswer={(answer, token) => this.addAnswer(answer, token)} />
          
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
TaskDetails.defaultProps = {
  task: {},
};
/*
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
});*/

const TaskDetailsQuery = gql`
  query TaskDetails($id: ID!) {
    task(id: $id) {
      _id,
      title,
      date,
      answers {
        answer,
        postedBy {
          username
        }
        date
      }
    }
  }
`;

const AddAnswerMutation = gql`
  mutation answer($taskId: ID!, $answer: AnswerInput!, $token: String!) {
    answer(taskId: $taskId, answer: $answer, token: $token) {
      answer
      date
      postedBy {
        username
      }
    }
  }
`;

export default graphql(AddAnswerMutation, {
  props: ({ownProps, mutate}) => ({
      addAnswer: (taskId, answer, token) => mutate({
        variables: {taskId, answer, token},
        optimisticResponse: {
          __typename: 'Mutation',
          answer: {
            __typename: 'Answer',
            answer: answer,
            date: new Date(),
            postedBy: {
              username: '',
            },
          },
        },
        updateQueries: {
          TaskDetails: (prev, { mutationResult }) => {
            const newAnswer = mutationResult.data.answer;
            console.log('new answer ', newAnswer)
            const existing = prev.task.answers.find(existingAnswer => existingAnswer.answer === newAnswer.answer);
            /*
            if (existing) {
              return prev;
            }
            */
            return update(prev, {
              task: {
                answers: {
                  $push: [newAnswer],
                },
              },
            });
          },
          Venue: (prev, { mutationResult }) => {
            const newAnswer = mutationResult.data.answer;
            console.log('new answer ', newAnswer)
            const taskInVenueIndex = prev.venue.tasks.findIndex(({_id}) => _id === ownProps.task._id);
            if (taskInVenueIndex <= -1) return prev;
            console.log(prev)
            return {
              ...prev,
              venue: {
                ...prev.venue,
                tasks: [
                  ...prev.venue.tasks.slice(0, taskInVenueIndex),
                  {
                    ...prev.venue.tasks[taskInVenueIndex],
                    nbAnswers: prev.venue.tasks[taskInVenueIndex].nbAnswers + 1,
                  },
                  ...prev.venue.tasks.slice(taskInVenueIndex + 1),
                ],
              },
            }
          }
        },
      }),
  }),
})(graphql(TaskDetailsQuery, {
  options: ({ id }) => ({
    variables: {id},
  }),
  props: ({ ownProps, data: { loading, error, task } }) => {
    return {
      loading,
      task: task || ownProps.task,
      error,
    };
  },
})(TaskDetails));

