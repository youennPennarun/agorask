const koa = require('koa');
const router = require('koa-router')();
const koaBunyanLogger = require('koa-bunyan-logger');
const routes = require('./routes');


require('dotenv').config({silent: true});

const mongoose = require('mongoose');
const mongooseConnection = require('./utils/mongo/connect');

mongooseConnection.on('error', console.error.bind(console, 'connection error:'));
mongooseConnection.once('open', function() {
  console.log('connected');
});

const app = koa();
app.use(koaBunyanLogger());
app.use(koaBunyanLogger.requestIdContext());
app.use(koaBunyanLogger.requestLogger());

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
