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
        {
          stdio: 'inherit',
        },
      );

      return true;
    } catch (e) {
      next({ error: e });
      return false;
    }
  } else {
    spinner.info('Not adding to git.');
  }
  next();
};
