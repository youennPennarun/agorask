/* @flow */

import React, {Component, PropTypes} from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import {clear, updateQuery, searchVenue} from '../../../redux/actions/search';
import {MKTextField} from 'react-native-material-kit';

import Icon from 'react-native-vector-icons/MaterialIcons';

const {width} = Dimensions.get('window');

const Textfield = MKTextField.textfield()
  .withPlaceholder('Search')
  .build();

type SearchBarPropsType = {
  query: string,
  search: Function,
  clearSearch: Function,
  updateSearchQuery: Function,
  openDrawer: Function,
};

export class SearchBar extends Component {
  static propTypes = {
    query: PropTypes.string,
    search: PropTypes.func.isRequired,
    clearSearch: PropTypes.func.isRequired,
    updateSearchQuery: PropTypes.func.isRequired,
    openDrawer: PropTypes.func.isRequired,
  };

  static defaultProps = {
    quer: '',
  };
  props: SearchBarPropsType;

  _tfRef: ?MKTextField = null;
  _onChangeText(text: string) {
    this.props.updateSearchQuery(text);
  }

  _onSubmit() {
    this.props.search();
  }
  _clear() {
    this.props.clearSearch();
  }
  _renderClearButton(): ?Object {
    if (!this.props.query) return null;
    return (
      <TouchableOpacity style={styles.rightIcon}
        onPress={() => { this._clear(); }}>
        <Icon name='close'
          size={20}
          color='#212121' />
      </TouchableOpacity>
    );
  }
  render(): Object {
    return (
      <View style={styles.container} >
        <TouchableOpacity style={styles.leftIcon}
          onPress={() => { this.props.openDrawer(); }} >
          <Icon name='menu'
            size={30}
            color='#929292' />
        </TouchableOpacity>
        <Textfield style={styles.textInput}
          ref={(tf) => { this._tfRef = tf; }}
          returnKeyType='search'
          placeholder='Search'
          blurOnSubmit
          onSubmitEditing={() => { this._onSubmit(); }}
          value={this.props.query}
          onChangeText={(text: string) => { this._onChangeText(text); }} />

        {this._renderClearButton()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: width - 20,
    height: 45,
    backgroundColor: 'white',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftIcon: {
    marginLeft: 5,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    height: 50,
    width: width - 100,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIcon: {
    height: 50,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});

/* istanbul ignore next */
const mapStateToProps = (state: Object): Object => ({
  query: state.search.query,
});
/* istanbul ignore next */
const mapDispatchToProps = (dispatch: Function): Object => ({
  clearSearch: () => {
    dispatch(clear());
  },
  updateSearchQuery: (query) => {
    dispatch(updateQuery(query));
  },
  search: () => {
    dispatch(searchVenue());
  },
});


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchBar);
