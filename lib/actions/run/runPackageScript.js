const spawn = require('cross-spawn');
const hasYarn = require('has-yarn');

/**
 * This action can be used to run a command line in a mooglee project (for example 'npm start')
 * the command line should be defined in the action under the "command" parameter
 * @param appPath
 * @param spinner
 * @param action
 * @param next
 */
module.exports = function ({ appPath, spinner, argv }, next) {
  if (!['start', 'dev', 'build', 'eject', 'json-server:prod', 'json-server:dev'].includes(argv.script)) {
    return next({error: `Unknown script "${argv.script}. Aborting.`})
  }

  const command = spawn(hasYarn('.') ? 'yarn' : 'npm', [ 'run', `${argv.script}`]);

  command.stdout.on('data', function (data) {
    console.log(data.toString().replace(/\n/, ''));
  });

  command.stderr.on('data', function (data) {
    console.error(data.toString());
  });

  command.on('exit', function (code) {
    spinner.info('child process exited with code ' + code.toString());
    next();
  });
};
