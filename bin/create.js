#!/usr/bin/env node

const runActions = require('../lib/runActions')

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
    desc: 'Setting the app details',
    action: require('../lib/actions/create/askForAppDetails'),
  },
  {
    desc: 'Setting the app configuration',
    action: require('../lib/actions/create/askForAppConfiguration'),
  },
  {
    desc: 'Creating the app directory',
    action: require('../lib/actions/create/mkdirSync'),
  },
  {
    desc: 'Generating the package.json file',
    action: require('../lib/actions/create/buildPackageJsonFile'),
  },
  {

    desc: 'Copying source files',
    action: require('../lib/actions/create/copySourcesFiles'),
  },
  {
    desc: 'Configuring your application',
    action: require('../lib/actions/create/replaceFilesTemplateVars'),
  },
  {
    desc: 'Installing node modules',
    action: require('../lib/actions/create/installModules'),
  },
];

module.exports = function (config) {
  return runActions(actions, config);
};
