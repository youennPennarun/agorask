const Auth = require('./Authentification');
const {User} = require('../utils/mongo/models');

const errors = {
  NOT_FOUND: new Error('NOT_FOUND'),
  INVALID_USER: new Error('INVALID_USER'),
  USERNAME_ALREADY_TAKEN: new Error('USERNAME_ALREADY_TAKEN'),
};

const getUser = function* (username, email) {
  return User.findOne({
    $or: [
      { username },
      { email },
    ],
  });
};

const register = function* (username, password, email) {
  let encryptedPassword;

  const existingUser = yield getUser(username, email);
  if (existingUser) {
    throw errors.USERNAME_ALREADY_TAKEN;
  }
  try {
    encryptedPassword = yield Auth.encrypt(password);
    const user = yield new User({
      username,
      password: encryptedPassword,
      email,
    }).save();
    return user;
  } catch (e) {
    throw e;
  }
};

const logIn = function* (username, password) {
  const user = yield User.findOne({username}).exec();
  if (!user) throw errors.INVALID_USER;
  const match = yield Auth.comparePassword(password, user.password);
  if (!match) throw errors.INVALID_USER;
  return user;
};

module.exports = {
  register,
  logIn,
  errors,
};