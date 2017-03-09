const Auth = require('./Authentification');
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

const register = async function (username, password, email) {
  let encryptedPassword;

  const existingUser = await getUser(username, email);
  if (existingUser) {
    throw errors.USERNAME_ALREADY_TAKEN;
  }
  try {
    encryptedPassword = await Auth.encrypt(password);
    const user = await new User({
      username,
      password: encryptedPassword,
      email,
    }).save();

    return user;
  } catch (e) {
    throw e;
  }
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
};
