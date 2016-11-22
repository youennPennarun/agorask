const Box = require('../services/Box');

function login() {
  const url = Box.getAuthorizeUrl(this.request.query.token);
  this.redirect(url);
}

function* callback() {
  const {tokenPayload, query: {code}} = this.request;
  const tokens = yield Box.getTokens(code);
  yield Box.storeToken(tokenPayload.id, tokens);
  this.body = tokens;
}

module.exports = {
  login,
  callback,
};
