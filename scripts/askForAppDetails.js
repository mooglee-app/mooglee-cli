const prompts = require('prompts');
const chalk   = require('chalk');

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
  ];

  if (argv.includes('--yes')) {
    data.appDetails = {};
    questions.forEach(function (_question) {
      data.appDetails[_question.name] = _question.initial;
    });
    return next();
  }

  spinner.stop();

  console.log(
    chalk.grey('\nInfo : you can always change these settings later\n'),
  );

  prompts(questions, { onCancel: function () {process.exit(0);} }).then(function (res) {
    data.appDetails = res;
    next();
  });
};