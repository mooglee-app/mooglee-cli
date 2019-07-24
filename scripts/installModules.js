const exec  = require('child_process').exec;
const shell = require('shelljs');

module.exports = function ({ appPath, spinner }, next) {
  shell.cd(appPath);
  exec('npm install', function (code, stdout, stderr) {
    console.log(code, stdout, stderr);
    spinner.indent = 1;
    if (stderr) {
      spinner.info(stderr);
    }
    if (stdout) {
      spinner.warn(stdout);
    }
    spinner.indent = 0;
    next();
  });
};