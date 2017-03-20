import React from 'react';
import { View, Text, Image, Dimensions, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import {MKTextField, MKColor} from 'react-native-material-kit';

import TopBar from '../../commons/TopBar';
import ProfilePic from '../../commons/ProfilePic';

const { width } = Dimensions.get('window');

type MyProfilePropsType = {
  username: string,
};

function MyProfile(props: MyProfilePropsType) {
  const profilePictureUrl = ProfilePic.getImageURL(props.username);
  return (
    <View style={styles.container} >
      <TopBar left={TopBar.BACK} right={TopBar.SUBMIT} title={'Profile'} />
      <View style={styles.header} >
        <Image style={styles.profilePic} source={{ uri: profilePictureUrl }} />
      </View>

      <View style={styles.form}>
        <Text style={styles.title} >Change password</Text>
        <PasswordInput placeholder='Old password' />
        <PasswordInput placeholder='New password' />
        <PasswordInput placeholder='Password confirmation' />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9e9e9',
  },
  header: {
    alignItems: 'center',
    backgroundColor: 'white',
    elevation: 5,
  },
  profilePic: {
    width,
    height: width * (9 / 16),
  },
  username: {
    fontSize: 30,
  },
  title: {
    marginLeft: 15,
    marginTop: 15,
    fontSize: 20,
  },
  form: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingBottom: 15,
    elevation: 3,
  },
  input: {
    height: 45,
  },
});

const PasswordInput = MKTextField.textfieldWithFloatingLabel()
  .withPassword(true)
  .withDefaultValue('')
  .withHighlightColor(MKColor.DeepPurple)
  .withStyle(styles.input)
  .withTextInputStyle(styles.textInput)
  .build();

function mapStateToProps(state): Object {
  return {
    ...state.user,
  };
}

export default connect(mapStateToProps)(MyProfile);
