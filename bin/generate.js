#!/usr/bin/env node

const runActions = require('../lib/runActions');

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
    desc: 'Checking if the current folder is a mooglee app',
    action: require('../actions/generate/isMoogleeProject')
  },
  {
    desc: 'Resolving your app configuration files',
    action: require('../actions/generate/resolveAppConfig')
  },
  {
    desc: 'Setting the component configuration',
    action: require('../actions/generate/askForComponentConfiguration'),
  },
  {
    desc: 'Generating your file',
    action: require('../actions/generate/generateFile'),
  },
];

module.exports = function (config) {
  return runActions(actions, config);
};