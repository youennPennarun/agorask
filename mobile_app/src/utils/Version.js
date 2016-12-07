/* flow */
/* global fetch */

import Config from 'react-native-config';
import {Alert, Linking} from 'react-native';

export function showUpdateModal(url) {
  Alert.alert(
    'A new version is available',
    'If the installation fail, uninstall the application and restart the installation',
  [
    {text: 'Ask me later', onPress: () => null},
    {text: 'Download', onPress: () => Linking.openURL(url)},
  ]);
}

export function checkForUpdate() {
  return new Promise((resolve, reject) => {
    // const url = `${Config.API_URL}/application/check/${Config.RELEASE_DATE}?type=${Config.BUILD_TYPE}`;
    const url = `${Config.API_URL}/application/check/${Config.RELEASE_DATE}?type=release`;
    console.log(url)
    fetch(url)
      .then((response: Object) => response.json())
      .then(json => {
        if (json.uptodate) {
          resolve(null);
        } else {
          resolve(json.downloadUrl);
        }
      })
      .catch(e => {
        console.log('error', e);
      });
  });
}
