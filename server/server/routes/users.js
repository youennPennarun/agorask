const koaBody = require('koa-body');
const {isLoggedIn, getUserImage, isAdmin, logIn, register, updateUserImage, setDeviceToken} = require('../middleware/users');
const {login: loginBox, callback} = require('../middleware/box');

module.exports = function(router) {
  /**
   * return {token: string}
   */
  router.post('/users/login', koaBody(), logIn);

  router.get('/users/image/:username', getUserImage);
  router.post('/users/image/:username', logIn, updateUserImage);

  router.post('/users/setDeviceToken', isLoggedIn, koaBody(), setDeviceToken);
  /**
   * return {token: string}
   */
  router.post('/users/register', koaBody({multipart: true}), register);

  router.get('/users/box', isLoggedIn, isAdmin, loginBox);
  router.get('/users/box/callback', function* (next) {
    this.request.query.token = this.request.query.state;
    yield next;
  }, isLoggedIn, isAdmin, callback);

  //router.get('/users', isLoggedIn, getUsers);
};
