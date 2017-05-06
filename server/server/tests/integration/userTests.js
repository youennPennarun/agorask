/* global describe, it */
const expect = require('chai').expect;
const co = require('co');
const fetch = require('node-fetch');

const { User } = require('../data');

describe('User Tests', () => {
  describe('login', () => {
    it('Should throw a 400 error if password field is empty', () => {
      return co(function* () {
        const response = yield fetch('http://localhost:3000/users/login', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: 'misterMeeseeks',
          }),
        });
        expect(response.status).to.be.equal(400);
        expect(response.statusText).to.be.equal('Bad Request');
      });
    });

    it('Should return the token if the request is successful', () => {
      return co(function* () {
        const response = yield fetch('http://localhost:3000/users/login', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: User[2].username,
            password: 'password',
          }),
        });
        expect(response.status).to.be.equal(200);
        const json = yield response.json();
        expect(json).to.have.property('token');
        expect(json.token).to.be.a('string').and.not.be.null;
      });
    });

    it('Should throw a 401 error if the password is invalid', () => {
      return co(function* () {
        const response = yield fetch('http://localhost:3000/users/login', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: 'dougalMcGuire',
            password: 'ohCrapThisIsTheWrongPassword',
          }),
        });
        expect(response.status).to.be.equal(401);
        expect(response.statusText).to.be.equal('Unauthorized');
      });
    });
  });

  describe('Register API', () => {
    it('Should throw a 400 error if username is missing', () => {
      return co(function* () {
        const response = yield fetch('http://localhost:3000/users/register', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            password: 'password',
            email: 'email@server.ext',
          }),
        });
        expect(response.status).to.be.equal(400);
        expect(response.statusText).to.be.equal('Bad Request');
      });
    });
    it('Should throw a 400 error if username is empty', () => {
      return co(function* () {
        const response = yield fetch('http://localhost:3000/users/register', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: '',
            password: 'password',
            email: 'email@server.ext',
          }),
        });
        expect(response.status).to.be.equal(400);
        expect(response.statusText).to.be.equal('Bad Request');
      });
    });

    it('Should throw a 400 error if password is missing', () => {
      return co(function* () {
        const response = yield fetch('http://localhost:3000/users/register', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: 'username',
            email: 'email@server.ext',
          }),
        });
        expect(response.status).to.be.equal(400);
        expect(response.statusText).to.be.equal('Bad Request');
      });
    });
    it('Should throw a 400 error if password is empty', () => {
      return co(function* () {
        const response = yield fetch('http://localhost:3000/users/register', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: 'username',
            password: '',
            email: 'email@server.ext',
          }),
        });
        expect(response.status).to.be.equal(400);
        expect(response.statusText).to.be.equal('Bad Request');
      });
    });

    it('Should throw a 400 error if email is missing', () => {
      return co(function* () {
        const response = yield fetch('http://localhost:3000/users/register', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: 'username',
            password: 'password',
          }),
        });
        expect(response.status).to.be.equal(400);
        expect(response.statusText).to.be.equal('Bad Request');
      });
    });
    it('Should throw a 400 error if email is empty', () => {
      return co(function* () {
        const response = yield fetch('http://localhost:3000/users/register', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: 'username',
            password: 'password',
            email: '',
          }),
        });
        expect(response.status).to.be.equal(400);
        expect(response.statusText).to.be.equal('Bad Request');
      });
    });
    it('Should throw a 400 error if the email address has a wrong format', () => {
      return co(function* () {
        const response = yield fetch('http://localhost:3000/users/register', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: 'username',
            password: 'password',
            email: 'email@server', // Wrong email address
          }),
        });
        expect(response.status).to.be.equal(400);
        expect(response.statusText).to.be.equal('Invalid parameters');
      });
    });

    it('Should throw a 409 error if the username is already taken', () => {
      return co(function* () {
        const response = yield fetch('http://localhost:3000/users/register', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: User[0].username,
            password: 'password',
            email: 'email@server.com',
          }),
        });
        expect(response.status).to.be.equal(409);
        expect(response.statusText).to.be.equal('Username already taken');
      });
    });

    it('Should throw a 409 error if the email address is already taken', () => {
      return co(function* () {
        const response = yield fetch('http://localhost:3000/users/register', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: 'shouldNotBeTaken',
            password: 'password',
            email: User[0].email,
          }),
        });
        expect(response.status).to.be.equal(409);
        expect(response.statusText).to.be.equal('Email already taken');
      });
    });
  });

  it('Should return the token if the request is successful', () => {
      return co(function* () {
        const response = yield fetch('http://localhost:3000/users/register', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: 'doyle',
            password: 'tea',
            email: 'doyle@tea-fan-club.co.uk',
          }),
        });
        expect(response.status).to.be.equal(200);
        const json = yield response.json();
        expect(json).to.have.property('token');
        expect(json.token).to.have.be.a('string').and.not.be.null;
      });
    });
});
