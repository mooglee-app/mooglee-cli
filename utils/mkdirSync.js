const fs   = require('fs');
const path = require('path');

module.exports = function (dirPath) {
  try {
    fs.mkdirSync(path.resolve(dirPath));
  } catch (err) {
    throw err;
  }
};