#!/usr/bin/env node

const chalk       = require('chalk');
const figlet      = require('figlet');
const packageJson = require('../package');
const path        = require('path');
const ora         = require('ora');
const parseArgv   = require('./lib/parseArgv');

// Get command line arguments
const argv = parseArgv();


if (argv.version) {
  console.log(`v${packageJson.version}`);
  process.exit(0);
}

console.log(
  chalk.yellow(
    figlet.textSync('Mooglee', {
      font: 'Standard',
    }),
    ` v${packageJson.version}`,
  ),
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
  appPath: path.resolve(argv.appPath),
  get appName() {return this.appPath.split('/').pop();},
  argv,
  spinner: ora('START').start(),
};

const requiredScript = {
  create: require('./create')
}[argv.command];

if (typeof requiredScript === 'function') {
  return requiredScript(config);
}