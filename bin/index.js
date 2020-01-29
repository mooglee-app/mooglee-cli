#!/usr/bin/env node

const chalk       = require('chalk');
const figlet      = require('figlet');
const packageJson = require('../package');
const path        = require('path');
const ora         = require('ora');
const parseArgv   = require('../lib/parseArgv');
const fs          = require('fs');

process.on('unhandledRejection', err => {
  throw err;
});

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
console.log();

/**
 * This is the config object passed to each action
 */
const config = {
  appPath: argv.appPath ? path.resolve(argv.appPath) : fs.realpathSync(process.cwd()),
  get appName() {return this.appPath.split('/').pop();},
  argv,
  spinner: ora('Jetzt geht\'s los 🔥\n').start(),
};

const requiredScript = {
  create: require('./create'),
  generate: require('./generate'),
  run: require('./run')
}[argv.command];

if (typeof requiredScript === 'function') {
  return requiredScript(config);
} else {
  console.log(`No script found for command "${argv.command}."`);
  exit(1);
}
