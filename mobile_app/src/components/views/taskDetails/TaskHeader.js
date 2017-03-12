/* @flow */

import React, {PropTypes} from 'react';
import {
  View,
  Animated,
  Text,
  StyleSheet,
} from 'react-native';
import gql from 'graphql-tag';
import ProfilePic from '../../commons/ProfilePic';

import moment from 'moment';

type TaskHeaderStateType = {
  radius: Animated.Value,
  marginHorizontal: Animated.Value,
  blockDateTranslationY: Animated.Value,
  dateOpacity: Animated.Value,
  nbAnswersOpacity: Animated.Value,
}

type TaskHeaderPropsType = {
  title: string,
  date: ?Date,
  postedBy: {
    username: string,
  },
  nbAnswers: number,
}

const initialState = {
  radius: 3,
  marginHorizontal: 10,
  blockDateTranslationY: 15,
  dateOpacity: 0,
  nbAnswersOpacity: 1,
};

class TaskHeader extends React.Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    nbAnswers: PropTypes.number.isRequired,
    postedBy: PropTypes.shape({
      username: PropTypes.string.isRequired,
    }).isRequired,
  };

  state: TaskHeaderStateType = {
    radius: new Animated.Value(initialState.radius),
    marginHorizontal: new Animated.Value(initialState.marginHorizontal),
    blockDateTranslationY: new Animated.Value(initialState.blockDateTranslationY),
    dateOpacity: new Animated.Value(initialState.dateOpacity),
    nbAnswersOpacity: new Animated.Value(initialState.nbAnswersOpacity),
  }

  props: TaskHeaderPropsType;

  componentDidMount() {
    const {
      radius,
      marginHorizontal,
      blockDateTranslationY,
      dateOpacity,
      nbAnswersOpacity,
    } = this.state;

    if (this.props.full) {
      Animated.parallel([
        Animated.timing(marginHorizontal, {
          toValue: 0,
          duration: 1000,
        }),
        Animated.timing(radius, {
          toValue: 0,
          duration: 1000,
        }),

        Animated.timing(blockDateTranslationY, {
          toValue: 0,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }
  componentWillReceiveProps(next: TaskHeaderPropsType) {
    const {
      radius,
      marginHorizontal,
      blockDateTranslationY,
    } = this.state;
    if (this.props.full !== next.full && !next.full) {
      Animated.parallel([
        Animated.timing(blockDateTranslationY, {
          toValue: initialState.blockDateTranslationY,
          useNativeDriver: true,
        }),
        Animated.timing(radius, {
          toValue: initialState.radius,
        }),
        Animated.timing(marginHorizontal, {
          toValue: initialState.marginHorizontal,
        }),
      ]).start();
    }
  }
  render(): React.Element<*> {
    const {title, date, postedBy} = this.props;
    return (
      <Animated.View style={[
        styles.questionContainer,
        {
          elevation: (date) ? 3 : 1,
          marginHorizontal: this.state.marginHorizontal,
          borderRadius: this.state.radius,
        }]} >
        <ProfilePic style={styles.pic} size={50} username={this.props.postedBy.username} />
        <View style={styles.leftColumn}>
          <Text style={styles.question} numberOfLines={2} ellipsizeMode='tail' >{title}</Text>
          <Text style={styles.postedBy} >
            {'Posted by: '}
            <Text style={styles.postedByUsername}>
              {postedBy.username}
            </Text>
          </Text>
        </View>
        <View style={styles.rightColumn}>
          <View style={styles.blockDate} >
            <Text>{moment(date).format('DD/MM/YY')}</Text>
          </View>
          <View style={styles.blockNbAnswers} >
            <Text>28 answers</Text>
          </View>
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  questionContainer: {
    flexDirection: 'row',
    height: 80,
    backgroundColor: 'white',
    elevation: 1,
    marginBottom: 0,
    paddingLeft: 5,
  },
  pic: {
    alignSelf: 'center',
  },
  leftColumn: {
    flex: 0.70,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  question: {
    marginLeft: 5,
    textAlignVertical: 'center',
    fontSize: 16,
    fontWeight: '800',
    color: '#212121',
  },
  postedBy: {
    fontWeight: '100',
    fontSize: 12,
    marginLeft: 15,
  },
  postedByUsername: {
    color: '#020202',
    fontSize: 13,
  },
  rightColumn: {
    flex: 0.30,
    marginRight: 5,
    marginVertical: 5,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  blockDate: {
    alignItems: 'flex-start',
  },
  blockNbAnswers: {
    alignItems: 'flex-end',
  },
});

TaskHeader.fragments = {
  task: gql`
    fragment Task on Task {
      _id
      title,
      nbAnswers,
      postedBy {
        username,
      }
    }
  `,
};

export default TaskHeader;
