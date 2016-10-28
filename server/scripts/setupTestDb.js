require('dotenv').config();
process.env.MONGO_URL = process.env.MONGO_URL_TEST || process.env.MONGO_URL;

const connection = require('../server/utils/mongo/connect');
const data = require('../server/tests/data');
const mongoose = require('mongoose');
const co = require('co');

connection.on('error', (e) => {
  console.log(e);
  process.exit(1);
}); 
connection.once('open', () => 
  co(function* () {
    try {
      for(const model in data) {
        yield mongoose.models[model].remove().exec()
        yield mongoose.models[model].insertMany(data[model]);
      }
      
    } catch (e) {
      console.log(e);
      process.exit(1);
    }
  }).then(() => process.exit())
);