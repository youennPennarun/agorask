/* global describe it */
/* eslint-disable no-unused-expressions */

const expect = require('chai').expect;
const Auth = require('../../services/Authentification');

describe('Auth', () => {
  describe('token', () => {
    it('Should build a valid token', (done) => {
      const data = {username: 'John'};
      const token = Auth.getToken(data);
      expect(token).to.not.be.null;
      const payload = Auth.isTokenValid(token);
      expect(payload).not.to.be.equal(false);
      expect(payload).to.have.property('username', data.username);
      done();
    });
  });
});
