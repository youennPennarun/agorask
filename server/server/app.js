require('dotenv').config({silent: true});
const koa = require('koa');
const serve = require('koa-static');
const router = require('koa-router')();
const koaBunyanLogger = require('koa-bunyan-logger');
const path = require('path');
const fs = require('fs');

if (!fs.existsSync(path.join(__dirname, '../tmp'))) {
    fs.mkdirSync(path.join(__dirname, '../tmp'));
}

const routes = require('./routes');

const mongoose = require('mongoose');
const mongooseConnection = require('./utils/mongo/connect');

mongooseConnection.on('error', console.error.bind(console, 'connection error:'));
mongooseConnection.once('open', () => {
  console.log('connected');
});

const app = koa();
app.use(serve(path.join(__dirname, '../public')));
app.use(koaBunyanLogger());
app.use(koaBunyanLogger.requestIdContext());
app.use(koaBunyanLogger.requestLogger());

routes(router);
const port = process.env.PORT || 3000;
app
  .use(function* (next) {
    try {
      yield next;
    } catch (e) {
      // TODO error logging, handling...
      if (e.errorData) {
        this.status = e.status || 500;
        this.message = e.message;
        const error = Object.assign({}, e.errorData, {
          statusCode: e.status,
          status: e.message,
        });
        this.body = error;
      } else {
        throw e;
      }
    }
  })
  .use(router.routes())
  .use(router.allowedMethods());
app.listen(port);
console.log(`listening on port ${port}`);
