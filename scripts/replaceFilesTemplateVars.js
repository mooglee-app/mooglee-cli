const replace = require('replace-in-file');
const fs = require('fs')

function getReplacementConfig({ appConfig, appDetails }) {
  const replaceStack = [
    { from: '<<<APP_NAME>>>', to: appConfig.name },
    { from: '<<<APP_DESCRIPTION>>>', to: appConfig.description },
    { from: '<<<PORT>>>', to: appConfig.port },
    { from: '<<<ENABLE_FAKE_API>>>', to: appConfig.enableFakeAPI },
    { from: '<<<ENABLE_SERVICE_WORKER>>>', to: appConfig.enableServiceWorker },
    { from: '<<<ENABLE_TRANSLATION>>>', to: appConfig.enableTranslation },
    { from: '<<<API_HOSTNAME>>>', to: appConfig.apiHostname },
    { from: '<<<API_PORT>>>', to: appConfig.apiPort },
    { from: '<<<API_PROTOCOL>>>', to: appConfig.apiUseSSL ? 'https' : 'http' },
    { from: '<<<API_PATHNAME>>>', to: appConfig.apiPathname },
  ];

  return {
    from: replaceStack.map(_r => _r.from),
    to: replaceStack.map(_r => _r.to),
  };
}

module.exports = function ({ appPath }, next, data) {
  try {
    replace({
      files: [
        `${appPath}/**`,
        `${appPath}/**/**`,
        `${appPath}/**/**/**`,
        `${appPath}/**/**/**/**`,
      ],
      ...getReplacementConfig(data),
    })
      .then(function(res) {
        fs.rename(`${appPath}/_env.development`, `${appPath}/.env.development`, function(error) {
          if ( error ) return next({error})
          fs.rename(`${appPath}/_env.production`, `${appPath}/.env.production`, function(error) {
            if ( error ) return next({error})
            fs.rename(`${appPath}/_env.test`, `${appPath}/.env.test`, function(error) {
              if ( error ) return next({error})
              next();
            });
          });
        });
      })
      .catch(function(error) {
        next({error})
      })

  } catch (error) {
    next({ error });
  }
};