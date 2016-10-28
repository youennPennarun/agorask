const koa = require('koa');
const router = require('koa-router')();
const routes = require('./routes');
try {
  // eslint-disable-next-line global-require
  require('dotenv').config();
} catch(e) {
  console.log('unable to load .env file');
}
const mongoose = require('mongoose');
const mongooseConnection = require('./utils/mongo/connect');

mongooseConnection.on('error', console.error.bind(console, 'connection error:'));
mongooseConnection.once('open', function() {
  console.log('connected');
});

const app = koa();

routes(router);
const port = process.env.SERVER_PORT || 3000;
app
  .use(function* (next) {
    try {
      yield next;
    } catch (e) {
      // TODO error logging, handling...
      throw e;
    }
  })
  .use(router.routes())
  .use(router.allowedMethods());
app.listen(port);
console.log(`listening on port ${port}`);
