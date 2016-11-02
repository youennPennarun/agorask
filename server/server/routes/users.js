const koaBody = require('koa-body')();
const {isLoggedIn, logIn, register} = require('../middleware/users');

module.exports = function(router) {
  /**
   * return {token: string}
   */
  router.post('/users/login', koaBody, logIn);
  /**
   * return {token: string}
   */
  router.post('/users/register', koaBody, register);

  //router.get('/users', isLoggedIn, getUsers);
};
