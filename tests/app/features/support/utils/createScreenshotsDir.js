const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '../../../screenshots/');
const NEW_IMAGES_PATH = `${(process.env.CIRCLE_ARTIFACTS || '/tmp/agorask_build')}/screenshots/`;

function createDir(dir) {
  dir.split('/').reduce((previousPath, currentDirectory) => {
    const cPath = `${previousPath}/${currentDirectory}`;
    if (!fs.existsSync(cPath)) {
      fs.mkdirSync(cPath)
    }
    return cPath;
  });
  return dir
}

module.exports = function(dirname) {
  const initial = createDir(path.join(ROOT, dirname));
  const newImages = createDir(path.join(NEW_IMAGES_PATH, dirname));
  
  return {
    initial,
    newImages,
  };
}