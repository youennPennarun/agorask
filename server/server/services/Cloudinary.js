const Cloudinary = require('cloudinary');

Cloudinary.config({
  cloud_name: 'dejc8mtld',
  api_key: '395481291965346',
  api_secret: process.env.COULDINARY_API_SECRET || 'secret',
});

function upload(filePath) {
  return new Promise((resolve, reject) => {
    Cloudinary.uploader.upload(filePath, result => {
      if (result.error) return reject(result.error);
      const {width, height, url} = result;
      resolve({width, height, url});
    });
  });
}


module.exports = {
  Cloudinary,
  upload,
};
