/* @flow */
import ImagePicker from 'react-native-image-picker';

const imagePickerOptions = {
  title: 'Select Avatar',
  customButtons: [],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

export default (): Promise => new Promise((resolve, reject) => {
  ImagePicker.showImagePicker(imagePickerOptions, response => {
    if (response.didCancel) {
      return resolve();
    } else if (response.error) {
      return reject(response.error);
    }
    return resolve(response);
  });
});
