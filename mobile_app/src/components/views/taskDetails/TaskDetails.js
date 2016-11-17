import React, {Component, PropTypes} from 'react';
import {View, Text} from 'react-native';
import { connect } from 'react-redux';

class TaskDetails extends Component {
  render() {
    return (
      <View>
        <Text>{this.props.name}</Text>
        <Text>{this.props.title}</Text>
      </View>
    );
  }
}

TaskDetails.propTypes = {
  taskKey: PropTypes.number.isRequired,
};

const mapStateToProps = (state, props) => {
  const {name, tasks} = state.selectedVenue.venue;
  return {
    name,
    ...tasks[props.taskKey],
  };
};

const mapDispatchToProps = (dispatch: Function, props): Object => ({
  getTaskAnswers: () => {},
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskDetails);
