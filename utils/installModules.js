const exec  = require('child_process').exec;
const shell = require('shelljs');

module.exports = function (dirPath) {

  shell.cd(dirPath);
  exec('npm install', function (code, stdout, stderr) {
    // console.log('Exit code:', code);
    // console.log('Program output:', stdout);
    // console.log('Program stderr:', stderr);
    // TODO handle output and errors
  });
};