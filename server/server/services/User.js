const Auth = require('./Authentification');
const Cloudinary = require('./Cloudinary');
const crypto = require('crypto');
const {User} = require('../utils/mongo/models');

const errors = {
  NOT_FOUND: new Error('NOT_FOUND'),
  INVALID_USER: new Error('INVALID_USER'),
  USERNAME_ALREADY_TAKEN: new Error('USERNAME_ALREADY_TAKEN'),
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
    throw errors.USERNAME_ALREADY_TAKEN;
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
    url: `https://www.gravatar.com/avatar/${hash}`,
    width: 800,
    height: 800,
  };
};

const updateImage = async function(userId, filePath) {
  const uploadedImage = await Cloudinary.upload(filePath);
  await User.update({_id: userId}, { $set: { image: uploadedImage }}).exec();
  return uploadedImage;
};

const getImage = async function(email) {
  const query = User.findOne({email}, {})
    .select(['image']);
  const user = await query.exec();
  if (!user) return null;
  if (!user.image) return getDefaultImage(email);
  return user.image;
};

const logIn = async function (username, password) {
  const user = await User.findOne({username}).exec();
  if (!user) throw errors.INVALID_USER;
  const match = await Auth.comparePassword(password, user.password);
  if (!match) throw errors.INVALID_USER;
  return user;
};

module.exports = {
  register,
  logIn,
  errors,
  getUserById,
  getImage,
  updateImage,
};
