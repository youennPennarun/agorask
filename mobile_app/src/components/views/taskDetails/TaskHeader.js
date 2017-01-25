import React, {PropTypes} from 'react';
import {
  View,
  Animated,
  Dimensions,
  Text,
  StyleSheet,
  InteractionManager,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import gql from 'graphql-tag';

const {width} = Dimensions.get('window');

import moment from 'moment';

const initialState = {
  radius: 3,
  marginHorizontal: 10,
  blockDateTranslationY: 15,
  dateOpacity: 0,
  nbAnswersOpacity: 1,
};

class TaskHeader extends React.Component {
  state = {
    radius: new Animated.Value(initialState.radius),
    marginHorizontal: new Animated.Value(initialState.marginHorizontal),
    blockDateTranslationY: new Animated.Value(initialState.blockDateTranslationY),
    dateOpacity: new Animated.Value(initialState.dateOpacity),
    nbAnswersOpacity: new Animated.Value(initialState.nbAnswersOpacity),
  }

  componentDidMount() {
    const {radius, marginHorizontal, blockDateTranslationY, dateOpacity, nbAnswersOpacity} = this.state;

    if (this.props.date) {
      console.log('yo')
      Animated.parallel([
        Animated.timing(marginHorizontal, {
          toValue: 0,
          duration: 1000,
        }),
        Animated.timing(radius, {
          toValue: 0,
          duration: 1000,
        }),
      ]).start();
    }
    InteractionManager.runAfterInteractions(() => {
      if (this.props.date) {
        Animated.parallel([
          Animated.timing(blockDateTranslationY, {
            toValue: 0,
            useNativeDriver: true,
          }),
          Animated.timing(dateOpacity, {
            toValue: 1,
            useNativeDriver: true,
          }),
          Animated.timing(nbAnswersOpacity, {
            toValue: 0,
            useNativeDriver: true,
          }),
        ]).start();
      }
    });
  }
  componentWillReceiveProps(next) {
    const {radius, marginHorizontal, blockDateTranslationY, dateOpacity, nbAnswersOpacity} = this.state;
    if (this.props.date !== next.date && !next.date) {
      Animated.parallel([
        Animated.timing(blockDateTranslationY, {
          toValue: initialState.blockDateTranslationY,
          useNativeDriver: true,
        }),
        Animated.timing(dateOpacity, {
          toValue: initialState.dateOpacity,
          useNativeDriver: true,
        }),
        Animated.timing(nbAnswersOpacity, {
          toValue: initialState.nbAnswersOpacity,
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
  render() {
    const {title, date, postedBy} = this.props;
    return (
      <Animated.View style={[
        styles.questionContainer,
        {
          elevation: (date) ? 3 : 1,
          marginHorizontal: this.state.marginHorizontal,
          borderRadius: this.state.radius,
        }]} >
        <View style={styles.leftColumn}>
          <Text style={styles.question} >{title}</Text>
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
    height: 60,
    backgroundColor: 'white',
    elevation: 1,
    marginBottom: 0,
    paddingLeft: 5,
  },
  leftColumn: {
    flex: 0.75,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  question: {
    marginLeft: 5,
    textAlignVertical: 'center',
    fontSize: 18,
    color: '#212121',
  },
  postedBy: {
    fontSize: 12,
    marginLeft: 15,
  },
  postedByUsername: {
    color: '#020202',
    fontSize: 13,
  },
  rightColumn: {
    flex: 0.25,
    marginRight: 20,
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

TaskHeader.propTypes = {
  title: PropTypes.string.isRequired,
  nbAnswers: PropTypes.number.isRequired,
};
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
