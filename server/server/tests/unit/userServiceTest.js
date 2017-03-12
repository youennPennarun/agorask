/* global describe it */
/* eslint-disable no-unused-expressions */

const expect = require('chai').expect;
const User = require('../../services/User');
const co = require('co');
const path = require('path');
const cloudinaryMock = require('../data/cloudinary/mockApi');

const userData = require('../data').User;

cloudinaryMock.mock();

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
          expect(user).to.have.property('image');
          expect(user.image).to.have.property('url');
        }, e => {
          throw e;
        });
    });

    it('Should be able to pass an image', async () => {
      const imagePath = path.join(__dirname, '../data/jack.jpg');
      const user = await User.register('jackHackettWithImage', 'password', 'jackHackettWithImage@drink.com', imagePath);
      expect(user).to.have.property('_id');
      expect(user).to.have.property('username', 'jackHackettWithImage');
      expect(user).to.have.property('password');
      expect(user).to.have.property('email', 'jackHackettWithImage@drink.com');
      expect(user).to.have.property('image');
      expect(user.image).to.have.property('width', cloudinaryMock.uploadResponse.width);
      expect(user.image).to.have.property('height', cloudinaryMock.uploadResponse.height);
      expect(user.image).to.have.property('url', cloudinaryMock.uploadResponse.url);
    });
  });

  describe('get image', () => {
    it('shoud return the user profile image', async () => {
      const image = await User.getImage('jackHackettWithImage');
      console.log(image)
      expect(image).to.have.property('width', cloudinaryMock.uploadResponse.width);
      expect(image).to.have.property('height', cloudinaryMock.uploadResponse.height);
      expect(image).to.have.property('url', cloudinaryMock.uploadResponse.url);
    });
    it('shoud return an image from gravatar if the user haven\'t uploaded a picture', async () => {
      const image = await User.getImage('jackHackett');
      expect(image).to.be.have.property('url', 'https://www.gravatar.com/avatar/6c36bc9e22d166ebc0b7059a2dd234c8?d=mm');
      expect(image).to.be.have.property('width', 800);
      expect(image).to.be.have.property('height', 800);
    });
    it('shoud return null if the user isn\'t registered', async () => {
      const image = await User.getImage('nope@nope.nop');
      expect(image).to.be.null;
    });
  });
});
