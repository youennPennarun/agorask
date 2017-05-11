const admin = require('firebase-admin');

const {User} = require('../utils/mongo/models');
admin.initializeApp({
  credential: admin.credential.cert({
    type: 'service_account',
    project_id: 'agorask-1478863365064',
    private_key_id: '55a2543002d9525ea51ae40c9a5c55eafc35fb0d',
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: 'firebase-adminsdk-vcz60@agorask-1478863365064.iam.gserviceaccount.com',
    client_id: '100430624612539580314',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://accounts.google.com/o/oauth2/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-vcz60%40agorask-1478863365064.iam.gserviceaccount.com',
  }),
  databaseURL: 'firebase-adminsdk-vcz60@agorask-1478863365064.iam.gserviceaccount.com',
});

async function sendMessage(userId, message) {
  const user = await User.findOne({_id: userId})
    .select('deviceToken')
    .exec();
    console.log(message);
  if (!user || !user.deviceToken) return Promise.reject({error: 'No token'});
  console.log("=============================================")
  admin.messaging().sendToDevice(user.deviceToken, message).then(function(response) {
    // See the MessagingDevicesResponse reference documentation for
    // the contents of response.
    console.log("Successfully sent message:", response);
  })
  .catch(function(error) {
    console.log("Error sending message:", error);
  });
}

module.exports = {
  sendMessage,
};
