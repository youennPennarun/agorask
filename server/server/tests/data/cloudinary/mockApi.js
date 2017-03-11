const nock = require('nock');
const Cloudinary = require('../../../services/Cloudinary').Cloudinary;

const uploadResponse = {
  public_id: 'dejc8mtld',
  version: 1312461204,
  width: 864,
  height: 576,
  format: 'jpg',
  bytes: 120253,
  url: 'http://res.cloudinary.com/demo/image/upload/v1371281596/sample.jpg',
  secure_url: 'https://res.cloudinary.com/demo/image/upload/v1371281596/sample.jpg' 
};
const re = /(^.+\.com)(\/.+$)/;
function mock() {
  const uploadUrl = Cloudinary.utils.api_url('upload', {});
  const [url, hostname, path] = uploadUrl.match(re);
  nock(hostname)
      .post(path)
      .reply(200, uploadResponse);
}

module.exports = {
  uploadResponse,
  mock,
};
