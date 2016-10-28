const koaBody = require('koa-body')();
const {isLoggedIn, logIn, register} = require('../middleware/users');

const dbMock = [
  {
    id: 1, title: 'poopy',
  },
  {
    id: 2, title: 'youra',
  },
  {
    id: 3, title: 'not inspired',
  },
];

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
