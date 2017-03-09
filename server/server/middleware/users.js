const Auth = require('../services/Authentification');
const User = require('../services/User');

async function register (ctx) {
  const {username, password, email} = ctx.request.body;
  if (!username || !password || !email) {
    ctx.throw(400, 'Missing parameters');
  }
  try {
    await User.register(username, password, email);
  } catch (e) {
    if (e.name === 'ValidationError') return ctx.throw('Invalid parameters', 400);
    if (e === User.errors.USERNAME_ALREADY_TAKEN) return ctx.throw('Username already taken', 409);
    return ctx.throw('InternalServerError', 500);
  }
  const token = Auth.getToken({username});
  ctx.body = { token };
}

async function isLoggedIn(ctx, next) {
  const payload = Auth.isTokenValid(ctx.request.query.token);
  if (!payload) {
    return ctx.throw('Unauthorized', 401, {errorData: {error: 'invalid token'}});
  }
  ctx.request.tokenPayload = payload;
  await next();
}

async function isAdmin(ctx, next) {
  if (!ctx.request.tokenPayload || !ctx.request.tokenPayload.isAdmin) {
    ctx.throw('Unauthorized', 401, {errorData: {error: 'Require admin privileges'}});
  }
  await next();
}

async function logIn (ctx) {
  const {username, password} = ctx.request.body;
  let user;
  if (!username || !password) return ctx.throw(400);
  try {
    user = await User.logIn(username, password);
  } catch (e) {
    if (e === User.errors.INVALID_USER) return ctx.throw('Unauthorized', 401);
    return ctx.throw('InternalServerError', 500);
  }
  const token = Auth.getToken({id: user._id, username: user.username, isAdmin: !!user.isAdmin});
  ctx.body = { token };
}


module.exports = {
  isLoggedIn,
  isAdmin,
  register,
  logIn,
};
