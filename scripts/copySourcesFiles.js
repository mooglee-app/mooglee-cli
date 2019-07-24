const ncp   = require('ncp').ncp;
const path = require('path')
module.exports = function ({ appPath }, next) {
  ncp(path.join(__dirname, '../src'), appPath, function (error) {
    if (error) {
      return next({ error });
    } else {
      next();
    }
  });
};