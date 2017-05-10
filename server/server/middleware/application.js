
const parse = require('co-busboy');
const path = require('path');
const fs = require('fs');

const Application = require('../services/Application');

function checkFile (fieldname, file, filename) {
  if (path.extname(filename) !== '.apk') {
    const err = new Error('invalid ak file');
    err.status = 400;
    return err;
  }
}

function* newRelease (ctx) {
  const parts = parse(ctx, {
    checkFile,
    autoFields: true,
  });
  if (!ctx.params.releaseDate || !ctx.query.type) return ctx.throw('BadRequest', 400);
  const version = ctx.query.version || ctx.params.releaseDate;
  const dest = path.join(
    __dirname,
    `../../tmp/${Application.getApplicationFullName(ctx.params.release)}`
  );
  let part;
  // eslint-disable-next-line no-cond-assign
  while ((part = yield parts)) {
    const stream = fs.createWriteStream(dest);
    part.pipe(stream);
    console.log('uploading %s -> %s', part.filename, stream.path);
  }
  const app = yield Application.newRelease(ctx.request.tokenPayload, ctx.params.releaseDate, version, ctx.query.type, dest);
  ctx.body = {app};
}

async function getApplicationVersion (ctx) {
  const version = await Application.getApplicationVersion(ctx.params.version);
  ctx.body = {version};
}

async function download (ctx) {
  const version = ctx.query.version;
  const type = ctx.params.type || 'release';
  const downloadLink = await Application.getDownloadLink(type, version);
  if (!downloadLink) return ctx.throw('Not Found', 404);
  console.log('link ', downloadLink);
  ctx.response.redirect(downloadLink);
}

async function getAvailableVersions () {
  const versions = await Application.getAvailableVersions();
  ctx.body = versions;
}

async function checkForUpdates(ctx) {
  const releaseDate = ctx.params.releaseDate;
  const type = ctx.query.type || 'release';
  if (!releaseDate || isNaN(releaseDate)) return ctx.throw('BadRequest', 400, {errorData: {error: 'Invalid release date parameter'}});
  if (!type) return ctx.throw('BadRequest', 400, {errorData: {error: 'Invalid query parameter "type"'}});
  const version = await Application.checkForUpdates(parseInt(releaseDate), type);
  ctx.body = version || {uptodate: true};
}

module.exports = {
  getApplicationVersion,
  download,
  newRelease,
  getAvailableVersions,
  checkForUpdates,
};
