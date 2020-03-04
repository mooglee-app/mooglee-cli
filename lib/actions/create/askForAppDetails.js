const prompts = require('prompts');
const chalk   = require('chalk');

module.exports = function ({ argv, spinner, config, appName }, next, data) {

  const questions = [

  ];
  if (argv.yes) {
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
