const fs   = require('fs');
const path = require('path');

module.exports = function ({ appPath, spinner }, next, data) {
  try {
    const routes = require(path.join(appPath, 'routes'));
    const config = require(path.join(appPath, 'config'));

    data.appRoutes = routes;

    if (config) {
      data.appConfig = config;
    } else {
      data.appConfig = {
        lang: {},
      };
      spinner.info('No configuration file has been found for your app.');
    }
  } catch (error) {
    spinner.info('No configuration file has been found for your app.');
  }
    next();
};