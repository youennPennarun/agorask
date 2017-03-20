import React, {PropTypes} from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import {MKColor} from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import {popRoute} from '../../redux/actions/router';

const { width } = Dimensions.get('window');

function renderIcon(icon) {
  if (typeof icon === 'string') {
    return <Icon name={icon} size={30} />;
  }
  return icon;
}

function renderAction(action, dispatch) {
  if (!action) return null;
  return (
    <TouchableOpacity style={styles.button} onPress={() => { action.action(dispatch); }} >
      { renderIcon(action.icon) }
    </TouchableOpacity>
  );
}

function TopBar(props) {
  return (
    <View style={styles.container} >
      <View style={styles.button} >
        { renderAction(props.left) }
      </View>
      <Text style={styles.title}>{props.title}</Text>
      <View style={styles.button} >
        { renderAction(props.right) }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    height: 50,
    backgroundColor: MKColor.DeepPurple,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  button: {
    justifyContent: 'space-around',
  },
  title: {
    color: 'white',
    fontSize: 25,
  },
});

TopBar.BACK = {
  action: (dispatch) => {dispatch(popRoute())},
  icon: <Icon name='arrow-back' size={30} />,
};
TopBar.SUBMIT = {
  action: () => null,
  icon: <Icon name='send' size={30} />,
};

const ActionType = {
  icon: PropTypes.object,
  action: PropTypes.func.isRequired,
  enabled: PropTypes.bool,
};

TopBar.propTypes = {
  left: PropTypes.objectOf(ActionType),
  right: PropTypes.objectOf(ActionType),
  title: PropTypes.string,
};

TopBar.defaultProps = {
  right: null,
  left: null,
  title: '',
};

export default connect()(TopBar);
