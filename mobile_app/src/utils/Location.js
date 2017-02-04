
import { NativeModules } from 'react-native';

const watchers = [];
function onLocation(location) {
  NativeModules.Location.watchPosition(onLocation);
  watchers.forEach(cb => {
    cb(location);
  });
}

let mod = navigator.geolocation;
if (NativeModules.Location) {
  mod = {
    ...NativeModules.Location,
    getCurrentPosition: (cb, errorCb, opts) => {
      NativeModules.Location.getPosition(cb)
    },
    watchPosition: cb => {
      if (!watchers.length) {
        console.log('Native watch position');
        NativeModules.Location.watchPosition(onLocation);
      }
      watchers.push(cb);
      return watchers.length - 1;
    },
    clearWatch: (id) => {
      watchers.splice(id, 1);
      if (!watchers.length) {
        console.log('Native clear watch position');
        NativeModules.Location.clearWatch();
      }
    },
  };
}

module.exports = mod;
