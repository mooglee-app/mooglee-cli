const replace = require('replace-in-file');
const fs      = require('fs');

/**
 * Defines all the template variables we should look for
 * and the value that should replace them
 * @param appConfig
 * @param appDetails
 */
function getReplacementConfig({ appConfig, appDetails }) {
  const replaceStack = [
    { from: /\[%APP_NAME%\]/g, to: appDetails.name },
    { from: /\[%APP_DESCRIPTION%\]/g, to: appDetails.description },
    { from: /\[%PORT%\]/g, to: appConfig.port },
    { from: /\[%USE_API%\]/g, to: appConfig.useAPI },
    { from: /\[%ENABLE_SERVICE_WORKER%\]/g, to: appConfig.enableServiceWorker },
    { from: /\[%ENABLE_TRANSLATION%\]/g, to: appConfig.enableTranslation },
    { from: /\[%API_HOSTNAME%\]/g, to: appConfig.apiHostname },
    { from: /\[%API_PORT%\]/g, to: appConfig.apiPort },
    { from: /\[%API_PROTOCOL%\]/g, to: appConfig.apiUseSSL ? 'https' : 'http' },
    { from: /\[%API_PATHNAME%\]/g, to: appConfig.apiPathname },
    { from: /\[%API_FETCH_PAGES_DATA%\]/g, to: appConfig.useAPI && appConfig.apiFetchPagesData },
    { from: /\[%API_PAGES_DATA_ENDPOINT%\]/g, to: appConfig.apiPagesDataEndpoint },
    { from: /\[%API_FETCH_SETTINGS_DATA%\]/g, to: appConfig.useAPI && appConfig.apiFetchSettingsData },
    { from: /\[%API_SETTINGS_DATA_ENDPOINT%\]/g, to: appConfig.apiSettingsDataEndpoint },
    { from: /\[%PAGE_DATA_RENDER_DEFINITION%\]/g, to: appConfig.useAPI ? ', pageData' : '' },
    { from: /\[%PAGE_DATA_LAYOUT_DEFINITION%\]/g, to: appConfig.useAPI ? ' pageData={pageData}' : '' },
  ];


  /*
  This is used to remove entire blocks from the templates depending on the configuration
  Each block in the array should have a 'shouldBeRemoved' and a 'templateName' attr
  This is an example of removable block : [%!TEMPLATE_NAME ... TEMPLATE_NAME!%]
  Where '...' is the code that should be removed
   */
  [
    { shouldBeRemoved: !appConfig.enableTranslation, templateName: 'ENABLE_TRANSLATION' },
    { shouldBeRemoved: !appConfig.apiFetchPagesData, templateName: 'API_FETCH_PAGES_DATA' },
    { shouldBeRemoved: !appConfig.apiFetchSettingsData, templateName: 'API_FETCH_SETTINGS_DATA' },
  ].forEach(_block => {
      if (_block.shouldBeRemoved) {
        replaceStack.push({ from: new RegExp(`\\[%!${_block.templateName}.*${_block.templateName}!%\]`, 'gs'), to: '' });
      } else {
        replaceStack.push({ from: new RegExp(`\\[%!${_block.templateName}`, 'g'), to: '' });
        replaceStack.push({ from: new RegExp(`${_block.templateName}!%\]`, 'g'), to: '' });
      }
    });

  return {
    from: replaceStack.map(_r => _r.from),
    to: replaceStack.map(_r => _r.to),
  };
}

/**
 * This action is charged of replacing some template variables in every project files with
 * the user configuration
 *
 * While it is not possible to do this with hidden file (e.q .env), all the env files should be renamed
 * at the end of the process
 * @param appPath
 * @param next
 * @param data
 */
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
      .then(function (res) {
        const hiddenFilesToRename = ['_gitignore', '_env.development', '_env.test', '_env.production'];

        function recursiveHiddenFilesRename() {
          const filename = hiddenFilesToRename.pop();

          if (filename) {
            fs.rename(`${appPath}/${filename}`, `${appPath}/${filename.replace('_', '.')}`, function (error) {
              if (error) return next({ error });
              recursiveHiddenFilesRename();
            });
          } else {
            next();
          }
        }

        recursiveHiddenFilesRename();
      })
      .catch(function (error) {
        next({ error });
      });

  } catch (error) {
    next({ error });
  }
};
