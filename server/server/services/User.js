const Auth = require('./Authentification');
const Cloudinary = require('./Cloudinary');
const crypto = require('crypto');
const {User} = require('../utils/mongo/models');

const errors = {
  NOT_FOUND: new Error('NOT_FOUND'),
  INVALID_USER: new Error('INVALID_USER'),
  USERNAME_ALREADY_TAKEN: new Error('USERNAME_ALREADY_TAKEN'),
  EMAIL_ALREADY_TAKEN: new Error('EMAIL_ALREADY_TAKEN'),
};

const getUser = async function (username, email) {
  return User.findOne({
    $or: [
      { username },
      { email },
    ],
  });
};

const getUserById = async function (id, fields) {
  const query = User.findOne({_id: id});
  if (fields) {
    query.selected(fields);
  }
  return query.exec();
};

const register = async function (username, password, email, imagePath) {
  let encryptedPassword;

  const existingUser = await getUser(username, email);
  if (existingUser) {
    if (existingUser.username === username) throw errors.USERNAME_ALREADY_TAKEN;
    if (existingUser.email === email) throw errors.EMAIL_ALREADY_TAKEN;
  }
  let image;
  if (imagePath) {
    image = await Cloudinary.upload(imagePath);
  } else {
    image = getDefaultImage(email);
  }
  try {
    encryptedPassword = await Auth.encrypt(password);
    const user = await new User({
      username,
      password: encryptedPassword,
      email,
      image,
    }).save();
    return user;
  } catch (e) {
    throw e;
  }
};

const getDefaultImage = function(email) {
  const hash = (email) ? crypto.createHash('md5').update(email).digest('hex') : '';
  return {
    url: `https://www.gravatar.com/avatar/${hash}?d=mm&size=400`,
    width: 800,
    height: 800,
  };
};

const updateImage = async function(userId, filePath) {
  const uploadedImage = await Cloudinary.upload(filePath);
  await User.update({_id: userId}, { $set: { image: uploadedImage }}).exec();
  return uploadedImage;
};

const getImage = async function(username) {
  const query = User.findOne({username}, {})
    .select(['image', 'email']);
  const user = await query.exec();
  if (!user) return null;
  if (!user.image) return getDefaultImage(user.email);
  return user.image;
};

const logIn = async function (username, password) {
  const user = await User.findOne({username}).exec();
  if (!user) throw errors.INVALID_USER;
  const match = await Auth.comparePassword(password, user.password);
  if (!match) throw errors.INVALID_USER;
  return user;
};

const setDeviceToken = async function(userId, deviceToken) {
  return User.update({_id: userId}, { $set: { deviceToken }}).exec();
};

module.exports = {
  register,
  logIn,
  errors,
  getUserById,
  getImage,
  updateImage,
  setDeviceToken,
};
