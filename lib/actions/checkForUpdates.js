const chalk          = require('chalk');
const { execSync }   = require('child_process');
const checkForUpdate = require('update-check');
const path           = require('path');

function shouldUseYarn() {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' });
    return true;
  } catch (_) {
    return false;
  }
}


module.exports = async function ({appPath, spinner }, next) {
  const packageJson = require(path.resolve(__dirname, '../../package.json'));

  try {
    const res = await checkForUpdate(packageJson);

    if (res && res.latest) {
      const isYarn = shouldUseYarn();

      spinner.info(chalk.yellow.bold(`A new version of @mooglee/cli is available`));
      spinner.info(
        'You can update by running: ' +
        chalk.cyan(
          isYarn ? `yarn global add ${packageJson.name}` : `npm i -g ${packageJson.name}`,
        ),
      );
    }
  } catch (error) {
    next({ error });
  }
};
