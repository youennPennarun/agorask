/* global describe it */
/* eslint-disable no-unused-expressions */

const expect = require('chai').expect;
const User = require('../../services/User');
const co = require('co');

const userData = require('../data/userData');

describe('UserService', () => {
  describe('login', () => {
    it('Should throw an error if the user doesn\'t exists', () => {
      return co(User.logIn('misterMeeseeks', ''))
        .then(() => {
          throw new Error('Should have thrown an error');
        }).catch(e => {
          expect(e).to.be.equals(User.errors.INVALID_USER);
        });
    });

    it('Should get a user and return a token', () => {
      return co(User.logIn(userData[8].username, 'password'))
        .then(token => {
          expect(token).to.be.ok;
        }).catch(e => {
          throw e;
        });
    });

    it('Should throw an error if the password is invalid', () => {
      return co(User.logIn('dougalMcGuire', 'ohCrapThisIsTheWrongPassword'))
        .then(() => {
          throw new Error('Should have thrown an error');
        }).catch(e => {
          expect(e).to.be.equals(User.errors.INVALID_USER);
        });
    });
  });

  describe('register', () => {
    it('Should throw an error if username is missing', () => {
      return co(User.register(null, 'password', 'email@server.ext'))
        .then(() => {
          throw new Error('Should have thrown an error');
        })
        .catch(e => {
          expect(e).to.have.property('name', 'ValidationError');
          expect(e).to.have.property('errors');
          expect(e.errors).to.have.property('username');
          expect(e.errors.username).to.have.property('message', 'Path `username` is required.');
        });
    });

    it('Should throw an error if password is missing', () => {
      return co(User.register('username', null, 'email@server.ext'))
        .then(() => {
          throw new Error('Should have thrown an error');
        }, e => {
          expect(e).to.have.property('name', 'ValidationError');
          expect(e).to.have.property('errors');
          expect(e.errors).to.have.property('password');
          expect(e.errors.password).to.have.property('message', 'Path `password` is required.');
        });
    });

    it('Should throw an error if email is missing', () => {
      return co(User.register('username', 'password', null))
        .then(() => {
          throw new Error('Should have thrown an error');
        }, e => {
          expect(e).to.have.property('name', 'ValidationError');
          expect(e).to.have.property('errors');
          expect(e.errors).to.have.property('email');
          expect(e.errors.email).to.have.property('message', 'Path `email` is required.');
        });
    });

    it('Should throw an error if email has a wrong format', () => {
      return co(User.register('username', 'password', 'email@server'))
        .then(() => {
          throw new Error('Should have thrown an error');
        }, e => {
          expect(e).to.have.property('name', 'ValidationError');
          expect(e).to.have.property('errors');
          expect(e.errors).to.have.property('email');
          expect(e.errors.email).to.have.property('message', 'email is invalid');
        });
    });

    it('Should throw an error if the username is already taken', () => {
      return co(User.register(userData[5].username, 'password', 'email@server.com'))
        .then(() => {
          throw new Error('Should have thrown an error');
        }, e => {
          expect(e).to.have.property('message', User.errors.USERNAME_ALREADY_TAKEN.message);
        });
    });

    it('Should return the user if everything went well', () => {
      return co(User.register('jackHackett', 'password', 'jackHackett@drink.com'))
        .then((user) => {
          expect(user).to.have.property('_id');
          expect(user).to.have.property('username', 'jackHackett');
          expect(user).to.have.property('password');
          expect(user).to.have.property('email', 'jackHackett@drink.com');
        }, e => {
          throw e;
        });
    });
  });
});
