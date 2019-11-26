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


module.exports = async function ({ppPath, spinner }, next) {
  const packageJson = () => require(path.resolve(__dirname, '../../package.json'));

  const update = checkForUpdate(packageJson()).catch(() => null);

  try {
    const res = await update;
    if (res && res.latest) {
      const isYarn = shouldUseYarn();

      const _packageJson = packageJson();
      spinner.info(chalk.yellow.bold(`A new version of @mooglee/cli is available`));
      spinner.info(
        'You can update by running: ' +
        chalk.cyan(
          isYarn ? `yarn global add ${_packageJson.name}` : `npm i -g ${_packageJson.name}`,
        ),
      );
      spinner.info();
    }
  } catch {
    next();
  }
};
