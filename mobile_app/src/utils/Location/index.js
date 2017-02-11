
import { NativeModules } from 'react-native';
import NativeEventEmitter from 'NativeEventEmitter';

type GeoOptions = {
  timeout: number,
  maximumAge: number,
  enableHighAccuracy: bool,
  distanceFilter: number,
}

let mod;
if (NativeModules.Location) {
  const LocationEventEmitter = new NativeEventEmitter(NativeModules.Location);
  let subscriptions = [];
  let locationEventEmitterId;

  const onLocation = function({coords, callbackId}) {
    subscriptions[callbackId]({coords});
  }

  mod = {
    ...NativeModules.Location,
    getCurrentPosition: (cb) => {
      NativeModules.Location.getPosition(cb);
    },
    watchPosition: function (success: Function, error?: Function, options?: GeoOptions): number {
      const id = subscriptions.length;
      NativeModules.Location.watchPosition(id, options);
      subscriptions.push(success);
      if (!locationEventEmitterId) {
        locationEventEmitterId = LocationEventEmitter.addListener('locationChanged', onLocation);
      }
      return id;
    },
    clearWatch: (id) => {
      NativeModules.Location.clearWatch(id);
      subscriptions = [
        ...subscriptions.slice(0, id),
        ...subscriptions.slice(id + 1),
      ];
    },
  };
} else {
  mod = navigator.geolocation;
}
export default mod;
