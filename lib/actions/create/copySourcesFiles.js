const ncp   = require('ncp').ncp;
const path = require('path')
const rimraf = require("rimraf");
const fs = require('fs');

const listDir = (dir, fileList = []) => {

  let files = fs.readdirSync(dir);

  files.forEach(file => {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      fileList = listDir(path.join(dir, file), fileList);
    } else {
      if(/\.template$/.test(file)) {
        let name = file.replace('.template', '');
        let src = path.join(dir, file);
        let newSrc = path.join(dir, name);
        fileList.push({
          oldSrc: src,
          newSrc: newSrc
        });
      }
    }
  });

  return fileList;
};

module.exports = function ({ appPath }, next, data) {
  ncp(path.join(__dirname, '../../../src'), appPath, function (error) {
    if (!data.appConfig.enableTranslation) {
      rimraf.sync(path.join(appPath, 'public/static/locales'));
    }

    let foundFiles = listDir( appPath);
    foundFiles.forEach(f => {
      fs.renameSync(f.oldSrc, f.newSrc);
    });

    if (error) {
      return next({ error });
    } else {
      next();
    }
  });
};
