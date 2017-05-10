const Box = require('nodejs-box');
const fetch = require('node-fetch');
const co = require('co');

const {User, Application} = require('../utils/mongo/models');

const clientId = process.env.BOX_CLIENT_ID;
const clientSecret = process.env.BOX_CLIENT_SECRET;
const redirectUri = process.env.BOX_REDIRECT_URL;

const FOLDER_ID = 0;

async function storeToken(userId, {accessToken, refreshToken}) {
  const expireThe = new Date();
  expireThe.setMinutes(expireThe.getMinutes() + 50);
  const user = await User.update(
                {_id: userId},
                {$set: {
                  'externals.box.accessToken': accessToken,
                  'externals.box.refreshToken': refreshToken,
                  'externals.box.expireThe': expireThe,
                }}
              ).exec();
  return user;
}

async function getUserToken(userId) {
  const user = await User.findOne({_id: userId})
                .exec();
  if (!user || !user.externals || !user.externals.box || !user.externals.box.accessToken) {
    return null;
  }
  let {accessToken, refreshToken} = user.externals.box;
  if (!user.externals.box.expireThe || user.externals.box.expireThe < (new Date())) {
    const newTokens = await refreshTokens(user.externals.box);
    accessToken = newTokens.accessToken;
    refreshToken = newTokens.refreshToken;
    await storeToken(userId, {accessToken, refreshToken});
  }
  return {accessToken, refreshToken};
}

async function getTokens(code) {
  const response = await fetch('https://api.box.com/oauth2/token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=authorization_code&code=${code}&client_id=${clientId}&client_secret=${clientSecret}`,
  });
  const data = await response.json();
  if (response.status !== 200) return null;
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
  };
}

async function refreshTokens(userTokens) {
  console.log('refreshing token');
  const response = await fetch('https://api.box.com/oauth2/token', {
    method: 'POST',
    body: `grant_type=refresh_token&refresh_token=${userTokens.refreshToken}&client_id=${clientId}&client_secret=${clientSecret}`,
  });
  const data = await response.json();
  if (data.error) throw new Error(data.error);
  const {access_token, refresh_token, expires_in} = data;
  return {accessToken: access_token, refreshToken: refresh_token, expiresIn: expires_in};
}

function getAuthorizeUrl(userToken) {
  return `https://account.box.com/api/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${userToken}`;
}

function upload(userTokens, filePath, fileName) {
  return new Promise((resolve, reject) => {
    const box = new Box({
      access_token: userTokens.accessToken,
      refresh_token: userTokens.refreshToken,
    });
    co(deleteFileIfExists(fileName, userTokens.accessToken))
      .then(() => {
        box.files.upload(filePath, fileName, FOLDER_ID, (err, body) => {
          if (err) return reject(err);
          const {id, name} = body.entries[0];
          co(share(id, userTokens.accessToken))
            .then(downloadUrl => {
              resolve({
                boxId: id,
                name,
                downloadUrl,
              });
            }).catch(reject);
        });
    }).catch(reject);
  });
}

async function share(fileId, accessToken) {
  const body = {
    shared_link: {
      access: 'open',
      permissions: {
        can_download: true,
      },
    },
  };
  const response = await fetch(`https://api.box.com/2.0/files/${fileId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return data.shared_link.url;
}

async function fileExists(fileName, accessToken, limit = 1000, offset = 0) {
  const response = await fetch(`https://api.box.com/2.0/folders/${FOLDER_ID}/items?limit=${limit}&offset=${offset}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error);
  let file = data.entries.find(f => f.name === fileName);
  if (!file && data.total_count > limit + offset) {
    file = await fileExists(fileName, accessToken, limit, offset + limit);
  }
  return file || false;
}

async function deleteFile(fileId, accessToken) {
  const response = await fetch(`https://api.box.com/2.0/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return;
}

async function deleteFileIfExists(fileName, accessToken) {
    const file = await fileExists(fileName, accessToken);
    if (file) {
      await deleteFile(file.id, accessToken);
    }
}

async function getDownloadLink(type, version) {
  const query = {};
  if (type) {
    query.type = type;
  }
  if (version) {
    query.version = version;
  }
  const app = await Application.findOne(query)
                .sort({releaseDate: -1})
                .select('downloadUrl')
                .exec();
  return app;
}
module.exports = {
  storeToken,
  getAuthorizeUrl,
  getUserToken,
  upload,
  getTokens,
  getDownloadLink,
};
