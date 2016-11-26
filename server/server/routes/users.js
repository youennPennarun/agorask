const koaBody = require('koa-body')();
const {isLoggedIn, isAdmin, logIn, register} = require('../middleware/users');
const {login: loginBox, callback} = require('../middleware/box');

module.exports = function(router) {
  /**
   * return {token: string}
   */
  router.post('/users/login', koaBody, logIn);
  /**
   * return {token: string}
   */
  router.post('/users/register', koaBody, register);

  router.get('/users/box', isLoggedIn, isAdmin, loginBox);
  router.get('/users/box/callback', function* (next) {
    this.request.query.token = this.request.query.state;
    yield next;
  }, isLoggedIn, isAdmin, callback);

  //router.get('/users', isLoggedIn, getUsers);
};
