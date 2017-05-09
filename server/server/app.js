require('dotenv').config({silent: true});
const Koa = require('koa');
const convert = require('koa-convert');
const serve = require('koa-static');
const router = require('koa-router')();
const koaBunyanLogger = require('koa-bunyan-logger');

/* graphql */
const mount = require('koa-mount');
const graphqlHTTP = require('koa-graphql');
/*---------*/

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

const GraphQLSchemas = require('./graphql/schemas');

const app = new Koa();
app.use(koaBunyanLogger());
app.use(koaBunyanLogger.requestIdContext());
app.use(koaBunyanLogger.requestLogger());
app.use(serve(path.join(__dirname, '../public')));

app.use(mount('/graphql', convert(graphqlHTTP({
  schema: GraphQLSchemas,
  graphiql: true,
}))));

routes(router);
const port = process.env.PORT || 3000;
app
  .use(async (ctx, next) => {
    try {
      await next();
    } catch (e) {
      // TODO error logging, handling...
      if (e.errorData) {
        ctx.status = e.status || 500;
        ctx.message = e.message;
        const error = Object.assign({}, e.errorData, {
          statusCode: e.status,
          status: e.message,
        });
        console.log('ERROR => ', error)
        ctx.body = error;
      } else {
        console.log('ERROR => ', e)
        throw e;
      }
    }
  })
  .use(router.routes())
  .use(router.allowedMethods());


app.listen(port);