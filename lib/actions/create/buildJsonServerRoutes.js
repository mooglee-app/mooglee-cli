const fs     = require('fs');
const path   = require('path');
const rimraf = require('rimraf');


module.exports = function ({ appPath, spinner }, next, { appConfig }) {

  // Remove the json-server folder if this feature has not been enabled
  if (!appConfig.enableJsonServer) {
    rimraf.sync(path.join(appPath, 'json-server'));
    return next();
  }

  const outputFilename = path.resolve(path.join(appPath, 'json-server', 'api-routes.json'));
  const json           = {};
  const apiPathname    = appConfig.apiPathname;

  if (appConfig.apiFetchPagesData) {
    const endpointFormat = appConfig.apiPagesDataEndpoint;
    const routePath = `${apiPathname}${endpointFormat}`;

    json[routePath] = '/pages?pageId=:pageId';

    if (endpointFormat.indexOf(':lang') >= 0) {
      json[routePath] += '&lang=:lang'
    }
  }

  if (appConfig.apiFetchSettingsData) {
    const endpointFormat = appConfig.apiSettingsDataEndpoint;
    const routePath = `${apiPathname}${endpointFormat}`;

    json[routePath] = '/settings';

    if (endpointFormat.indexOf(':lang') >= 0) {
      json[routePath] += '?lang=:lang'
    }
  }

  fs.writeFile(outputFilename, JSON.stringify(json, null, 4), 'utf8', (error) => {
    if (error) {
      next({ error });
    } else {
      next();
    }
  });
};
