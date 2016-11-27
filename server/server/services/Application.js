const mongoose = require('mongoose');
const {Application} = require('../utils/mongo/models');
const Box = require('./Box');

const APP_NAME = 'agorask';

function getApplicationFullName(version) {
  return `${APP_NAME}_${version}.apk`;
}

function versionExists() {
  throw new Error('Not implemented yet');
}

function* newRelease (user, releaseDate, version, type, tmpPath) {
  const tokens = yield Box.getUserToken(user.id);
  const fileName = `agorask_${version}.apk`;
  const boxData = yield Box.upload(tokens, tmpPath, fileName);

  const app = new Application({
    releaseDate: new Date(parseInt(releaseDate)),
    version,
    type,
    boxId: boxData.boxId,
    fileName: boxData.name,
    downloadUrl: boxData.downloadUrl,
  });
  console.log(app);
  yield app.save();
  console.log('saved');
  return app;
}

function* getApplicationVersion () {
  const app = yield Application.findOne({})
                .sort({ releaseDate: -1 });
  if (!app) return null;
  return app.version;
}

function* getDownloadLink(version) {
  const url = yield Box.getDownloadLink(version);
  return url;
}

function* getAvailableVersions() {
  const versions = yield Application.find({})
                      .select({ releaseDate: 1, version: 1 });
  return versions;
}

module.exports = {
  getApplicationVersion,
  getDownloadLink,
  newRelease,
  getApplicationFullName,
  versionExists,
  getAvailableVersions,
};
