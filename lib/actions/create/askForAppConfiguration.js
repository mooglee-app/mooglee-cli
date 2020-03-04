const prompts = require('prompts');

module.exports = function ({ argv, spinner, config, appName }, next, data) {

  const questions = [
    {
      type: 'text',
      name: 'appPath',
      message: 'What\'s the name of your app ?',
      initial: appName,
    },
    {
      type: 'text',
      name: 'version',
      message: 'Would you like to use a custom version number ?',
      initial: '0.0.0',
    },
    {
      type: 'text',
      name: 'description',
      message: 'Give a description to your project',
      initial: '',
    },
    {
      type: 'toggle',
      name: 'useYarn',
      message: 'are you rather npm or yarn?',
      initial: !!argv['use-yarn'],
      active: 'Yarn',
      inactive: 'NPM',
    },
    {
      type: 'number',
      name: 'port',
      message: 'What port would you like to use?',
      initial: argv['port'] || 3000,
      style: 'default',
      min: 0,
      max: 999999,
    },
    {
      type: 'toggle',
      name: 'enableServiceWorker',
      message: 'Would you like to add a Service Worker to your project?',
      initial: !!argv['enable-sw'],
      active: 'yes',
      inactive: 'no',
    },
    {
      type: 'toggle',
      name: 'enableTranslation',
      message: 'Do you plan to build a mutli-language app?',
      initial: !!argv['enable-i18n'],
      active: 'yes',
      inactive: 'no',
    },
    {
      type: 'toggle',
      name: 'useApi',
      message: 'Do you plan to use an API on this project?',
      initial: !!argv['use-api'],
      active: 'yes',
      inactive: 'no',
    },
    {
      type: (_, values) => values.useApi && 'text',
      name: 'apiHostname',
      message: 'What\'s your API hostname?',
      initial: 'localhost',
    },
    {
      type: (_, values) => values.useApi && 'number',
      name: 'apiPort',
      message: 'What\'s your API port?',
      initial: 3001,
      style: 'default',
      min: 0,
      max: 999999,
    },
    {
      type: (_, values) => values.useApi && 'toggle',
      name: 'apiUseSSL',
      message: 'Which protocol your API is using?',
      initial: 'https',
      active: 'https',
      inactive: 'http',
    },
    {
      type: (_, values) => values.useApi && 'text',
      name: 'apiPathname',
      message: 'What\'s your API pathname?',
      initial: '/api',
    },
    {
      type: (_, values) => values.useApi && 'toggle',
      name: 'apiFetchPagesData',
      message: 'Do you wan\'t your app to fetch data from your API for your pages?',
      initial: true,
      active: 'yes',
      inactive: 'no',
    },
    {
      type: (_, values) => values.apiFetchPagesData && 'text',
      name: 'apiPagesDataEndpoint',
      message: 'What endpoint should be used for that?',
      initial: (_, values) => values.enableTranslation ? '/:lang/pages/:pageId' : '/pages/:pageId',
    },
    {
      type: (_, values) => values.useApi && 'toggle',
      name: 'apiFetchSettingsData',
      message: 'Do you wan\'t your app to fetch settings from your API for your app?',
      initial: true,
      active: 'yes',
      inactive: 'no',
    },
    {
      type: (_, values) => values.apiFetchSettingsData && 'text',
      name: 'apiSettingsDataEndpoint',
      message: 'What endpoint should be used for that?',
      initial: (_, values) => values.enableTranslation ? '/:lang/settings' : '/settings',
    },
    {
      type: (_, values) => values.useApi && 'toggle',
      name: 'enableJsonServer',
      message: 'Should we add json-server to your project to speed up your development?',
      initial: false,
      active: 'yes',
      inactive: 'no',
    },
  ];

  if (argv.yes) {
    data.appConfig = {};
    questions.forEach(function (_question) {
      data.appConfig[_question.name] = _question.initial;
    });
    return next();
  }

  spinner.stop();

  prompts(questions, { onCancel: function () {process.exit(0);} }).then(function (res) {
    questions.forEach(function (_question) {
      if (res[_question.name] === undefined || res[_question.name] === null || res[_question.name] === '') {
        res[_question.name] = _question.initial;
      }
    });
    data.appConfig = res;
    next();
  });
};
