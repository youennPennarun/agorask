const admin = require('firebase-admin');

const {User} = require('../utils/mongo/models');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: 'agorask-1478863365064',
    clientEmail: 'youenn.pennarun@gmail.com',
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
  }),
  databaseURL: 'https://agorask-1478863365064.firebaseio.com/',
});

async function sendMessage(userId, message) {
  const user = await User.findOne({_id: userId})
    .select('deviceToken')
    .exec();
  if (!user || !user.deviceToken) return Promise.reject({error: 'No token'});
  return admin.messaging().sendToDevice(user.deviceToken, message);
}

module.exports = {
  sendMessage,
};
