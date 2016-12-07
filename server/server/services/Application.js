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
  if (!tokens) {
    throw new Error('No Box tokens for this user');
  }
  const fileName = `agorask_${version}_${type}.apk`;
  const boxData = yield Box.upload(tokens, tmpPath, fileName);

  const app = new Application({
    releaseDate: new Date(parseInt(releaseDate)),
    version,
    type,
    boxId: boxData.boxId,
    fileName: boxData.name,
    downloadUrl: boxData.downloadUrl,
  });
  yield app.save();
  return app;
}

function* getApplicationVersion () {
  const app = yield Application.findOne({})
                .sort({ releaseDate: -1 });
  if (!app) return null;
  return app.version;
}

function* getDownloadLink(type, version) {
  const query = {};
  if (type) {
    query.type = type;
  }
  if (version) {
    query.version = version;
  }
  const app = yield Application.findOne(query)
                .sort({releaseDate: -1})
                .select('downloadUrl')
                .exec();
  if (!app || !app.downloadUrl) return null;
  return app.downloadUrl;
}

function* getAvailableVersions() {
  const versions = yield Application.find({})
                      .select({ releaseDate: 1, version: 1 });
  return versions;
}

function* checkForUpdates(releaseDate, type) {
  const version = yield Application.findOne({
                  releaseDate: {$gt: new Date(releaseDate)},
                  type: type,
                })
                .sort({releaseDate: -1})
                .select('downloadUrl')
                .exec();
  return version;
}

module.exports = {
  getApplicationVersion,
  getDownloadLink,
  newRelease,
  getApplicationFullName,
  versionExists,
  getAvailableVersions,
  checkForUpdates,
};
