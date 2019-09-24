const prompts = require('prompts');
const chalk   = require('chalk');

module.exports = function ({ spinner, config, appName }, next, data) {
  spinner.stop();

  console.log(
    chalk.grey('\nInfo : you can always change these settings later\n'),
  );

  prompts([
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
    },
  ], { onCancel: function () {process.exit(0);} }).then(function (res) {
    data.appDetails = res;
    next();
  });
};