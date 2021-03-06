/* @flow */
import React, { Component, PropTypes } from 'react';
import {
  View,
  Animated,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  BackAndroid,
  KeyboardAvoidingView,
} from 'react-native';
import { MKProgress, MKSpinner } from 'react-native-material-kit';
import { connect } from 'react-redux';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';
import { login } from '../../../redux/actions/router';

import TaskHeader from './TaskHeader';
import Vote from './Vote';
import AddAnswer from './AddAnswer';

const { width, height } = Dimensions.get('window');

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
};

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
  }
  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.onBack);
  }

  onBack = (): boolean => {
    this.setState({ isHiding: true });
    Animated.timing(this.state.bodyHeight, {
      toValue: 0,
      duration: 200,
    }).start();
    return false;
  };

  addAnswer(answer: string): Promise<Object> {
    return this.props.addAnswer(this.props.task._id, answer, this.props.token);
  }

  openBody(headerHeight) {
    if (this.isBodyOpen) return;
    this.isBodyOpen = true;
    Animated.timing(this.state.bodyHeight, {
      toValue: height - (headerHeight + 20),
      duration: 200,
    }).start();
  }

  _renderAnswer(
    { _id, answer, postedBy: { username }, date, rating = 0, userRating },
    key,
  ): any {
    const { token, rateAnswer, task } = this.props;
    const onVoteCallback = token
      ? value => {
          rateAnswer(task._id, _id, value, token);
        }
      : undefined;
    return (
      <View key={key} style={styles.answerContainer}>
        <View style={styles.row}>
          <Vote
            score={rating}
            userRating={userRating}
            onVote={onVoteCallback} />
          <View style={styles.answer}>
            <Text style={styles.answerText}>{answer}</Text>
            <View style={styles.answerFooter}>
              <Text style={styles.username}>{username}</Text>
              <Text style={styles.date}>{moment(date).format('DD/MM/YY')}</Text>
            </View>
          </View>
        </View>
        <View style={styles.separator} />
      </View>
    );
  }
  _renderProgressBar(): ?MKProgress.Indeterminate {
    const { loading, task } = this.props;
    const { answers = [] } = task;
    if (!loading || !answers.length) return null;
    return <MKProgress.Indeterminate style={styles.progress} />;
  }
  _renderSpinner(): ?MKSpinner {
    const { loading, task } = this.props;
    const { answers = [] } = task;
    if (!loading || answers.length) return null;
    return <MKSpinner style={styles.spinner} />;
  }
  render(): React.Element {
    const {
      title,
      date,
      answers = [],
      postedBy = { username: '' },
    } = this.props.task;
    return (
      <View style={styles.container}>
        {this._renderProgressBar()}
        <TaskHeader
          onLayout={({nativeEvent}) => {
            this.openBody(nativeEvent.layout.height);
          }}
          title={title}
          full={!this.state.isHiding}
          postedBy={postedBy}
          date={date}
          nbAnswers={answers.length} />
        <Animated.View
          style={{
            backgroundColor: 'white',
            height: this.state.bodyHeight,
          }}>
          <ScrollView >
            <KeyboardAvoidingView contentContainerStyle={{ backgroundColor: 'white' }}
              behavior='position'>
              {this._renderSpinner()}
                {answers
                  .filter(({ rating = 0 }) => rating > -5)
                  .sort(({ rating: ratingA = 0 }, { rating: ratingB = 0 }) => {
                    if (ratingA < ratingB) return 1;
                    if (ratingA > ratingB) return -1;
                    return 0;
                  })
                  .map((answer: Object, key: number): any =>
                    this._renderAnswer(answer, key),
                  )}
              <AddAnswer
                login={() => {
                  this.props.login();
                }}
                token={this.props.token}
                addAnswer={(answer): Promise<Object> => this.addAnswer(answer)} />
            </KeyboardAvoidingView>
          </ScrollView>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height,
  },
  sv: {},
  answersContainer: {
  },
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
  progress: {},
  spinner: {
    alignSelf: 'center',
    marginTop: 50,
    marginBottom: 25,
  },
});

const AnswerFragment = {
  answer: gql`
    fragment AnswerData on Answer {
     _id
        answer,
        postedBy {
          username
        }
        date
        rating
        userRating(token: $token) {
          rating
        }
    }
  `,
};

const TaskDetailsQuery = gql`
  query TaskDetails($id: ID!, $token: String) {
    task(id: $id) {
      _id,
      title,
      date,,
      postedBy {
        username
      }
      answers {
        ...AnswerData
      }
    }
  }
  ${AnswerFragment.answer}
`;

const AddAnswerMutation = gql`
  mutation answer($taskId: ID!, $answer: AnswerInput!, $token: String!) {
    answer(taskId: $taskId, answer: $answer, token: $token) {
      ...AnswerData
    }
  }
  ${AnswerFragment.answer}
`;

const RateMutation = gql`
  mutation rating($taskId: ID!, $answerId: ID!, $ratingValue: RatingInput!, $token: String!) {
    rating(taskId: $taskId, answerId: $answerId, ratingValue: $ratingValue, token: $token) {
      rating
    }
  }
`;

function mapStateToProps(state): Object {
  return {
    ...state.user,
  };
}
function mapDispatchToProps(dispatch): Object {
  return {
    login: () => {
      dispatch(login());
    },
  };
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  graphql(AddAnswerMutation, {
    props: ({ ownProps, mutate }): any => {
      return {
        addAnswer: (taskId, answer, token) =>
          mutate({
            variables: { taskId, answer, token },
            optimisticResponse: {
              __typename: 'Mutation',
              answer: {
                __typename: 'Answer',
                _id: null,
                answer: answer.answer,
                date: new Date().toISOString(),
                postedBy: {
                  username: '',
                  __typename: 'User',
                },
                userRating: null,
                rating: 0,
              },
            },
            updateQueries: {
              TaskDetails: (prev, { mutationResult }) => {
                const newAnswer = mutationResult.data.answer;
                const next = {
                  ...prev,
                  task: {
                    ...prev.task,
                    answers: [
                      ...prev.task.answers,
                      {
                        ...newAnswer,
                      },
                    ],
                  },
                };
                return next;
              },
              Venue: (prev, { mutationResult }) => {
                const newAnswer = mutationResult.data.answer;
                const taskInVenueIndex = prev.venue.tasks.findIndex(
                  ({ _id }): boolean => _id === ownProps.task._id,
                );
                if (taskInVenueIndex <= -1) return prev;
                return {
                  ...prev,
                  venue: {
                    ...prev.venue,
                    tasks: [
                      ...prev.venue.tasks.slice(0, taskInVenueIndex),
                      {
                        ...prev.venue.tasks[taskInVenueIndex],
                        nbAnswers: prev.venue.tasks[taskInVenueIndex]
                          .nbAnswers + 1,
                      },
                      ...prev.venue.tasks.slice(taskInVenueIndex + 1),
                    ],
                  },
                };
              },
            },
          }),
      };
    },
  }),
  graphql(TaskDetailsQuery, {
    options: ({ id, token }): Object => {
      return {
        variables: { id, token },
      };
    },
    props: ({ ownProps, data: { loading, error, task } }): Object => {
      return {
        loading,
        task: task || ownProps.task,
        error,
      };
    },
  }),
  graphql(RateMutation, {
    props: ({ mutate }) => {
      return {
        rateAnswer: (taskId, answerId, ratingValue, token) =>
          mutate({
            variables: { taskId, answerId, ratingValue, token },
            updateQueries: {
              TaskDetails: (prev, { mutationResult }) => {
                if (mutationResult.error) return prev;
                const answerIndex = prev.task.answers.findIndex(
                  answer => answer._id === answerId,
                );
                const newUserRating = ratingValue === 'POSITIVE' ? 1 : -1;
                if (answerIndex === -1) return prev;

                const next = {
                  ...prev,
                  task: {
                    ...prev.task,
                    answers: [
                      ...prev.task.answers.slice(0, answerIndex),
                      {
                        ...prev.task.answers[answerIndex],
                        rating: mutationResult.data.rating.rating,
                        userRating: {
                          ...prev.task.answers[answerIndex].userRating,
                          rating: newUserRating,
                          __typename: 'AnswerRatingUser',
                        },
                      },
                      ...prev.task.answers.slice(answerIndex + 1),
                    ],
                  },
                };
                return next;
              },
            },
          }),
      };
    },
  }),
)(TaskDetails);
