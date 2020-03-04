const exec  = require('child_process').exec;
const shell = require('shelljs');

module.exports = function ({ appPath, spinner }, next, data) {
  shell.cd(appPath);
  exec(`${data.appConfig.useYarn ? 'yarn' : 'npm'} install`, {stdio: 'inherit'}, function (code, stdout, stderr) {
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
