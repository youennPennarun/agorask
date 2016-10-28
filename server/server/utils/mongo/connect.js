const mongoose = require('mongoose');
require('./models');

mongoose.Promise = Promise;
const url = (process.env.ENV === 'test') ? process.env.MONGO_URL_TEST : process.env.MONGO_URL;
mongoose.connect(url);


module.exports = mongoose.connection;
