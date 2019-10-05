const fs   = require('fs');
const path = require('path');

module.exports = function ({ appPath }, next) {
  try {
    fs.mkdirSync(path.resolve(appPath));
    next();
  } catch (error) {
    next({ error });
  }
};