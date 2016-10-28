/* @flow */

import React, {Component} from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import {MKTextField} from 'react-native-material-kit';

import Icon from 'react-native-vector-icons/MaterialIcons';

const {width} = Dimensions.get('window');

const Textfield = MKTextField.textfield()
  .withPlaceholder('Search')
  .build();

class SearchBar extends Component {
  state = {
    text: '',
  };
  _onChangeText(text: string) {
    this.setState({text});
  }

  _renderClearButton(): ?Object {
    if (!this.state.text) return null;
    return (
      <TouchableOpacity style={styles.rightIcon}
        onPress={() => { this.setState({text: ''}); }}>
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
          returnKeyType='search'
          placeholder='Search'
          blurOnSubmit
          value={this.state.text}
          onChangeText={(text: string) => { this._onChangeText(text); }} />

        {this._renderClearButton()}
      </View>
    );
  }
}

SearchBar.propTypes = {

};

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

export default SearchBar;
