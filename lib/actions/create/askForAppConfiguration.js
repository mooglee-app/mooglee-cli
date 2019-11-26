const prompts = require('prompts');

const questions = [
  {
    type: 'number',
    name: 'port',
    message: 'What port would you like to use?',
    initial: 3000,
    style: 'default',
    min: 0,
    max: 999999,
  },
  {
    type: 'toggle',
    name: 'enableServiceWorker',
    message: 'Would you like to add a Service Worker to your project?',
    initial: true,
    active: 'yes',
    inactive: 'no',
  },
  {
    type: 'toggle',
    name: 'enableTranslation',
    message: 'Do you plan to build a mutli-language app?',
    initial: false,
    active: 'yes',
    inactive: 'no',
  },
  {
    type: 'toggle',
    name: 'useAPI',
    message: 'Do you plan to use an API on this project?',
    initial: false,
    active: 'yes',
    inactive: 'no',
  },
  {
    type: (_, values) => values.useAPI && 'toggle',
    name: 'enableFakeAPI',
    message: 'Would you like to enable the fake-api service for development?',
    initial: true,
    active: 'yes',
    inactive: 'no',
  },
  {
    type: (_, values) => values.useAPI && !values.enableFakeAPI && 'text',
    name: 'apiHostname',
    message: 'What\'s your API hostname?',
    initial: 'localhost',
  },
  {
    type: (_, values) => values.useAPI && !values.enableFakeAPI && 'number',
    name: 'apiPort',
    message: 'What\'s your API port?',
    initial: 3000,
    style: 'default',
    min: 0,
    max: 999999,
  },
  {
    type: (_, values) => values.useAPI && !values.enableFakeAPI && 'toggle',
    name: 'apiUseSSL',
    message: 'Which protocol your API is using?',
    initial: false,
    active: 'https',
    inactive: 'http',
  },
  {
    type: (_, values) => values.useAPI && !values.enableFakeAPI && 'text',
    name: 'apiPathname',
    message: 'What\'s your API pathname?',
    initial: (_, values) => values.enableFakeAPI ? '/fake-api' : '/',
  },
  {
    type: (_, values) => values.useAPI  && 'toggle',
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
    initial: (_, values) => values.enableTranslation ? '/{{lang}}/pages' : '/pages',
  },
  {
    type: (_, values) => values.useAPI  && 'toggle',
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
    initial: (_, values) => values.enableTranslation ? '/{{lang}}/settings' : '/settings',
  },
];

module.exports = function ({ argv, spinner, config, appName }, next, data) {
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
