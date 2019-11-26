const spawnSync = require('cross-spawn').sync;


module.exports = function ({ spinner }, next, data) {
  const {
          filePath,
          addToGit,
        } = data;

  if (addToGit) {
    try {
      spawnSync(
        'git',
        ['add', filePath],
      );
    } catch (e) {
      spinner.info('An error occurred when adding your file to git. Aborting.');
      next();
    }
  } else {
    spinner.info('Not adding to git.');
  }
  next();
};
