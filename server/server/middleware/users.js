const Auth = require('../services/Authentification');
const User = require('../services/User');
const parse = require('co-busboy');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const sharp = require('sharp');


function resize(imgPath) {
  return new Promise((resolve, reject) => {
    const dest = path.join(
      __dirname,
      `../../tmp/${new mongoose.mongo.ObjectId()}`
    );
    sharp(imgPath)
      .resize(600)
      .toFile(dest, (err, info) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(dest);
        }
      });
  });
}

async function register (ctx) {
  console.log(ctx.request.body)
  if (!ctx.request.body.fields) {
    ctx.request.body.fields = Object.assign({}, ctx.request.body);
  }
  if (!ctx.request.body.files) {
    ctx.request.body.files = {};
  }
  console.log("================================");
  console.log(ctx.request.body);
  console.log("================================");
  const {fields: {username, password, email}, files: {picture}} = ctx.request.body;
  if (!username || !password || !email) {
    ctx.throw(400, 'Missing parameters');
  }
  const filePath = (picture) ? await resize(picture.path) : null;
  let user = {};
  try {
    user = await User.register(username, password, email, filePath);
  } catch (e) {
    console.log(e);
    if (e.name === 'ValidationError') {
      let errorMessage = '';
      if (e.errors) {
        errorMessage = Object.keys(e.errors)
          .map(key => e.errors[key].message)
          .join(', ');
      } else {
        errorMessage = 'Form invalid';
      }
      return ctx.throw('Invalid parameters', 400, {errorData: {error: errorMessage}});
    }
    if (e === User.errors.USERNAME_ALREADY_TAKEN) return ctx.throw('Username already taken', 409, {errorData: {error: 'Username already taken'}});
    if (e === User.errors.EMAIL_ALREADY_TAKEN) return ctx.throw('Email already taken', 409, {errorData: {error: 'Email already taken'}});
    return ctx.throw('InternalServerError', 500);
  }
  const token = Auth.getToken({id: user._id, username: user.username, isAdmin: false});
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

async function getUserImage(ctx) {
  const image = await User.getImage(ctx.params.username);
  if (!image || !image.url) return ctx.throw(404);
   ctx.redirect(image.url);
}

async function updateUserImage(ctx) {
  const {id, username} = ctx.params;
  if (ctx.request.tokenPayload.username !== username) {
    return ctx.throw('Unauthorized', 401);
  }
  const parts = parse(ctx, {
    autoFields: true,
  });
  const dest = path.join(
    __dirname,
    `../../tmp/${new mongoose.mongo.ObjectId()}`
  );
  let part;
  // eslint-disable-next-line no-cond-assign
  while ((part = await parts)) {
    const stream = fs.createWriteStream(dest);
    part.pipe(stream);
    console.log('uploading %s -> %s', part.filename, stream.path);
  }
  ctx.body = User.updateImage(id, dest);
}

async function setDeviceToken(ctx) {
  const {deviceToken} = ctx.request.body;
  await User.setDeviceToken(ctx.request.tokenPayload.id, deviceToken);
  ctx.body = {success: true};
}


module.exports = {
  isLoggedIn,
  isAdmin,
  register,
  logIn,
  getUserImage,
  updateUserImage,
  setDeviceToken,
};
