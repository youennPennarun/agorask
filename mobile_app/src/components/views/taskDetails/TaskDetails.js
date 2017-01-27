import React, {Component, PropTypes} from 'react';
import {
  View,
  Animated,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  InteractionManager,
  BackAndroid,
} from 'react-native';
import {
  MKProgress,
  MKSpinner,
} from 'react-native-material-kit';
import update from 'immutability-helper';


import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';

import TaskHeader from './TaskHeader';
import Vote from './Vote';
import AddAnswer from './AddAnswer';


const {width, height} = Dimensions.get('window');

type TaskDetailsPropsType = {
  id: string,
  task: {
    name: string,
    title: string,
    date: string,
    answers: Array,
    postedBy: {
      username: string,
    },
  },
}

type TaskDetailsStateType = {
  bodyHeight: Animated.Value,
  isHiding: boolean,
};

export class TaskDetails extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    task: PropTypes.shape({
      name: PropTypes.string,
      title: PropTypes.string.isRequired,
      answers: PropTypes.array,
      postedBy: PropTypes.object,
    }).isRequired,
  };
  static defaultProps = {
    task: {
      postedBy: {
        username: '',
      },
    },
  };
  state: TaskDetailsStateType = {
    bodyHeight: new Animated.Value(0),
    isHiding: false,
  };
  props: TaskDetailsPropsType;

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.onBack);
    InteractionManager.runAfterInteractions(() => {
      Animated.timing(this.state.bodyHeight, {
        toValue: height,
        duration: 200,
      }).start();
    });
  }
  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.onBack);
  }

  onBack = (): boolean => {
    this.setState({isHiding: true});
    Animated.timing(this.state.bodyHeight, {
      toValue: 0,
      duration: 200,
    }).start();
    return false;
  }

  addAnswer(answer: string, token: string): Promise<Object> {
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
  _renderProgressBar(): ?MKProgress.Indeterminate {
    const {loading, task} = this.props;
    const {answers = []} = task;
    if (!loading || !answers.length) return null;
    return <MKProgress.Indeterminate style={styles.progress} />;
  }
  _renderSpinner(): ?MKSpinner {
    const {loading, task} = this.props;
    const {answers = []} = task;
    if (!loading || answers.length) return null;
    return <MKSpinner style={styles.spinner} />;
  }
  render(): React.Element {
    const {title, date, answers = [], postedBy = {username: ''}} = this.props.task;
    return (
      <View style={styles.container} >
        {this._renderProgressBar()}
        <ScrollView>
          <TaskHeader title={title}
            full
            postedBy={postedBy}
            date={(this.state.isHiding) ? undefined : date}
            nbAnswers={answers.length} />
          <Animated.View style={{
            backgroundColor: 'white',
            height: this.state.bodyHeight,
          }}>
          {this._renderSpinner()}
          <View style={[styles.answersContainer]} >
            {
              answers.map((answer: Object, key: number): any =>
                this._renderAnswer(answer, key),
              )
            }
          </View>
          <AddAnswer addAnswer={(answer, token): Promise<Object> => {
            return this.addAnswer(answer, token);
          }} />
          </Animated.View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
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



const TaskDetailsQuery = gql`
  query TaskDetails($id: ID!) {
    task(id: $id) {
      _id,
      title,
      date,,
      postedBy {
        username
      }
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

export default compose(
  graphql(AddAnswerMutation, {
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
              // const existing = prev.task.answers.find(existingAnswer => existingAnswer.answer === newAnswer.answer);
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
              const taskInVenueIndex = prev.venue.tasks.findIndex(({_id}): boolean => _id === ownProps.task._id);
              if (taskInVenueIndex <= -1) return prev;
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
              };
            },
          },
        }),
    }),
  }),
  graphql(TaskDetailsQuery, {
    options: ({ id }): Object => ({
      variables: {id},
    }),
    props: ({ ownProps, data: { loading, error, task } }): Object => {
      return {
        loading,
        task: task || ownProps.task,
        error,
      };
    },
  }),
)(TaskDetails);

