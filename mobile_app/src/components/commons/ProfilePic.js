import React, { PropTypes } from 'react';
import { View, Image } from 'react-native';

import Config from 'react-native-config';

type ProfilePicPropsType = {
  style: Object<*>,
  size: number,
  username: string,
};

function getStyle(props: ProfilePicPropsType) {
  return [
    props.style,
    {
      width: props.size,
      height: props.size,
      borderRadius: props.size / 2,
    },
  ];
}

function renderDefault(props: ProfilePicPropsType) {
  return (
    <View
      style={[
        ...getStyle(props),
        {
          backgroundColor: 'grey',
        },
      ]} />
  );
}

function ProfilePic(props: ProfilePicPropsType) {
  if (!props.username) return renderDefault(props);

  const imageUrl = `${Config.API_URL}/users/image/${props.username}`;
  return <Image style={getStyle(props)} source={{ uri: imageUrl }} />;
}
ProfilePic.propTypes = {
  style: PropTypes.string,
  size: PropTypes.number.isRequired,
  username: PropTypes.string,
};

ProfilePic.defaultProps = {
  style: {},
}

export default ProfilePic;
