const Auth = require('../services/Authentification');
const User = require('../services/User');

const isLoggedIn = function* (next) {
  const payload = Auth.isTokenValid(this.request.query.token);
  if (!payload) {
    return this.throw('Unauthorized', 401);
  }
  this.request.tokenPayload = payload;
  yield next;
};

const register = function* () {
  const {username, password, email} = this.request.body;
  if (!username || !password || !email) {
    this.throw(400, 'Missing parameters');
  }
  try {
    yield User.register(username, password, email);
  } catch (e) {
    if (e.name === 'ValidationError') return this.throw('Invalid parameters', 400);
    if (e === User.errors.USERNAME_ALREADY_TAKEN) return this.throw('Username already taken', 409);
    return this.throw('InternalServerError', 500);
  }
  const token = Auth.getToken({username});
  this.body = { token };
};

const logIn = function* () {
  const {username, password} = this.request.body;
  let user;
  if (!username || !password) return this.throw('BadRequest', 400);
  try {
    user = yield User.logIn(username, password);
  } catch (e) {
    if (e === User.errors.INVALID_USER) return this.throw('BadRequest', 400);
    return this.throw('InternalServerError', 500);
  }
  const token = Auth.getToken({username: user.username});
  this.body = { token };
};



module.exports = {
  isLoggedIn,
  register,
  logIn,
};