const path = require('path');

module.exports = function ({appPath}, next, data) {
  try {
    const appPackage = require(path.join(appPath, 'package.json'));

    if (!appPackage || !appPackage._isMoogleeApp) {
      return next({ error: 'The current directory is not a mooglee app.'})
    }
    data.isEjectedApp = !!appPackage._isEjectedApp;
    next();
  } catch(error) {
    return next({error})
  }
};
