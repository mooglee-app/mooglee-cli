const prompts = require('prompts');

module.exports = function ({ argv, spinner, config, appName }, next, data) {

  const questions = [
    {
      type: 'text',
      name: 'name',
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
  ];

  if (argv.yes) {
    data.appConfig = {};
    questions.forEach(function (_question) {
      data.appConfig[_question.name] = _question.type === 'toggle'
        ? true
        : _question.initial;
    });
    return next();
  } else if (argv.default) {
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
