const ncp   = require('ncp').ncp;
const path = require('path')
const rimraf = require("rimraf");

module.exports = function ({ appPath }, next, data) {
  ncp(path.join(__dirname, '../../../src'), appPath, function (error) {
    if (!data.appConfig.enableTranslation) {
      rimraf.sync(path.join(appPath, 'locales'));
    }
    if (error) {
      return next({ error });
    } else {
      next();
    }
  });
};
