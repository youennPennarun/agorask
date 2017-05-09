const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');

const secret = 'veryVerySecret';

const getToken = function(payload) {
  return jwt.sign(payload, secret);
};

const isTokenValid = function(token) {
  let payload;
  try {
    payload = jwt.verify(token, secret);
  } catch (e) {
    return false;
  }
  return payload;
};


const encrypt = function(password) {
  return new Promise((resolve, reject) => {
    if (!password) return resolve(null);
    bcrypt.genSalt(10, (error, salt) => {
      if (error) return reject(error);
      return bcrypt.hash(password, salt, null, (err, hash) => {
        if (err) return reject(err);
        return resolve(hash);
      });
    });
  });
};

const comparePassword = async function(password, hash) {
  const promise = new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, match) => {
      if (err) return reject(err);
      return resolve(match);
   });
  });
  return await promise;
};



module.exports = {
  getToken,
  isTokenValid,
  encrypt,
  comparePassword,
};