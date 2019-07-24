#!/usr/bin/env node

const inquirer             = require('inquirer');
const chalk                = require('chalk');
const figlet               = require('figlet');
const shell                = require('shelljs');
const package              = require('../package');
const mkdirSync            = require('../utils/mkdirSync');
const buildPackageJsonFile = require('../utils/buildPackageJsonFile');
const path                 = require('path');
const installModules       = require('../utils/installModules');

console.log(
  chalk.green(
    figlet.textSync('make-next-react-app', {
      font: 'Standard',
    }),
  ),
);
console.log(
  chalk.green(` v${package.version}`),
);

const appPath = path.resolve(process.argv[2] || 'make-next-react-app');
const appName = appPath.split('/').pop();

console.log('1) Create the app directory');
console.log();
mkdirSync(appPath);

console.log('2) Generate the package.json file');
console.log();
buildPackageJsonFile(appName, appPath);

console.log('3) Install node modules');
console.log();
installModules(appPath);