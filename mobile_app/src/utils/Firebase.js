import FCM, {
  FCMEvent,
  RemoteNotificationResult,
  WillPresentNotificationResult,
  NotificationType,
} from 'react-native-fcm';

import Config from 'react-native-config';

export function setDeviceToken(userToken: string, deviceToken: ?string) {
  return fetch(`${Config.API_URL}/users/setDeviceToken?token=${userToken}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      deviceToken,
    }),
  });
}

export function configure(onRegister: Function) {
  FCM.requestPermissions(); // for iOS
  FCM.getFCMToken().then(token => {
    onRegister(token);
  });
  this.notificationListener = FCM.on(FCMEvent.Notification, async notif => {
    // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
    console.log('##############################################');
    console.log('##############################################');
    console.log('##############################################');
    console.log('##############################################');
    console.log('##############################################');
    console.log(notif);
    if (notif.local_notification) {
      console.log('local notif');
    }
    if (notif.opened_from_tray) {
      console.log('from tray');
      // app is open/resumed because user clicked banner
    }
    if (notif.fcm) {
      const {title, body} = notif.fcm;
      console.log('presentLocalNotification!!!!!!!');

      FCM.presentLocalNotification({
        title: title, // as FCM payload
        body: body, // as FCM payload (required)
        priority: 'high', // as FCM payload
        click_action: 'ACTION.HELLO', // as FCM payload
        auto_cancel: true, // Android only (default true)
        vibrate: 300, // Android only default: 300, no vibration if you pass null
        lights: false, // Android only, LED blinking (default false)
        show_in_foreground: true, // show notification when app is in foreground (local & remote)
        local: true,
      });
    }
  });
}
