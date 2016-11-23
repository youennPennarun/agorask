
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

function* newRelease () {
  const parts = parse(this, {
    checkFile,
    autoFields: true,
  });
  if (!this.params.releaseDate) return this.throw('BadRequest', 400);
  const version = this.query.version || this.params.releaseDate;
  const dest = path.join(
    __dirname,
    `../../tmp/${Application.getApplicationFullName(this.params.release)}`
  );
  let part;
  // eslint-disable-next-line no-cond-assign
  while ((part = yield parts)) {
    const stream = fs.createWriteStream(dest);
    part.pipe(stream);
    console.log('uploading %s -> %s', part.filename, stream.path);
  }
  const app = yield Application.newRelease(this.request.tokenPayload, this.params.releaseDate, version, dest);
  this.body = {app};
}

function* getApplicationVersion () {
  const version = yield Application.getApplicationVersion(this.params.version);
  this.body = {version};
}

function* download () {
  const version = this.params.version;
  const downloadLink = yield Application.getDownloadLink(version);
  console.log('link ', downloadLink);
  this.response.redirect(downloadLink);
}

function* getAvailableVersions () {
  const versions = yield Application.getAvailableVersions();
  this.body = versions;
}

module.exports = {
  getApplicationVersion,
  download,
  newRelease,
  getAvailableVersions,
};