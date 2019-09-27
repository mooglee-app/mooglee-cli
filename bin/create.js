#!/usr/bin/env node

const chalk       = require('chalk');


/**
 * Each action that will be executed one by one in the given order
 * Each action should at least have the following attributes :
 *  desc {string} : A short description of the action
 *  action {func} : The action that should be called
 *
 * Each action will be called with three parameters
 *   config {object} : Contains the config
 *   next {func} : A callback that should be triggered when the action has finished its job
 *   data {object} : A global object passed to each action
 *
 * => An action can return a Promise. In that case it should not call the next callback
 *
 * Inside the actions, an object can be passed to the next callback with the following attributes :
 *   error {*} : An error to be thrown
 * @type {*[]}
 */
const actions = [
  {
    desc: 'Set app details',
    action: require('../scripts/askForAppDetails'),
  },
  {
    desc: 'Set app configuration',
    action: require('../scripts/askForAppConfiguration'),
  },
  {
    desc: 'Create the app directory',
    action: require('../scripts/mkdirSync'),
  },
  {
    desc: 'Generate the package.json file',
    action: require('../scripts/buildPackageJsonFile'),
  },
  {

    desc: 'Copy source files',
    action: require('../scripts/copySourcesFiles'),
  },
  {
    desc: 'Configure your application',
    action: require('../scripts/replaceFilesTemplateVars'),
  },
  {
    desc: 'Install node modules',
    action: require('../scripts/installModules'),
  },
];

module.exports = function (config) {

  let _counter = 0;
  let next     = function () {};
  const data = {};

  /**
   * The next callback function used to execute the actions
   * @param res
   */
  next = function (res = {}) {

    // Throw any error
    if (res.error) {
      config.spinner.fail(chalk.red(res.error));
      return;
    }

    // Log a success message after every action call
    if (_counter > 0 && typeof config.spinner.succeed === 'function') {
      config.spinner.succeed(chalk.green(actions[_counter - 1].desc));
    }

    // Check that there is an action to execute
    const _action = actions[_counter];
    if (_action && typeof _action === 'object' && typeof _action.action === 'function') {

      // Log the action description
      config.spinner = config.spinner.start(chalk.blue(_action.desc));

      _counter++;

      // Execute the action
      const _ret = _action.action(config, next, data);

      // Handle asynchronous actions call
      if (_ret && typeof _ret.then === 'function') {
        _ret.then(function () {
          next();
        })
          .catch(function (error) {
            next({ error });
          });
      }

    } else {
      console.log();
      console.log(chalk.bold.bgGreen('Your app is ready ! :)'));
      console.log();
      config.spinner.stop();
    }
  };

  // Let's started by executing the first action in the stack
  next();
};