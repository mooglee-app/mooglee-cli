#!/usr/bin/env node

const chalk   = require('chalk');
const figlet  = require('figlet');
const package = require('../package');
const path    = require('path');
const ora     = require('ora');

console.log(
  chalk.yellow(
    figlet.textSync('Mooglee', {
      font: 'Standard',
    }),
  ),
);
console.log(
  chalk.yellow(` v${package.version}`),
);
console.log(
  chalk.yellow(` Made with love by Chuck Durst`),
);
console.log();
console.log();


/**
 * This is the config object passed to each action
 */
const config = {
  appPath: path.resolve(process.argv[2] || 'mooglee-app'),
  get appName() {return this.appPath.split('/').pop();},
  argv: process.argv.slice(1),
  spinner: ora('START').start(),
};

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
 * An object can be passed to the next callback with the following attributes :
 *   error {*} : An error to be thrown
 * @type {*[]}
 */
const actions = [
  {
    desc: 'Create the app directory',
    action: require('../scripts/mkdirSync'),
  },
  {
    desc: 'Generate the package.json file',
    action: require('../scripts/buildPackageJsonFile'),
  },
  {
    desc: 'Install node modules',
    action: require('../scripts/installModules'),
  },
  {

    desc: 'Copy source files',
    action: require('../scripts/copySourcesFiles'),
  },
];

let _counter = 0;
let next     = function () {};

/**
 * The next callback function used to execute the actions
 * @param res
 */
next = function (res = {}) {

  // Throw any error
  if (res.error) {
    config.spinner.error(chalk.red(res.error));
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
    _action.action(config, next, res);

  } else {
    console.log();
    console.log(chalk.bold.bgGreen('Your app is ready ! :)'));
    console.log();
    config.spinner.stop();
  }
};

next();