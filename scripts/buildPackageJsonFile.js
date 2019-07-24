const fs   = require('fs');
const path = require('path');


module.exports = function ({ appName, appPath, spinner }, next) {
  const outputFilename = path.resolve(path.join(appPath, 'package.json'));
  const json           = JSON.stringify({
    'name': appName,
    'version': '1.0.0',
    'description': 'A web application built with React and NextJs',
    'scripts': {
      'test': 'echo "Error: no test specified" && exit 1',
      'postinstall': 'link-module-alias',
    },
    '_moduleAliases': {
      'mooglee': '../../mooglee-scripts',
    },
    'dependencies': {
      'mnra-scripts': 'git+ssh://git@github.com/chuck-durst/mnra-scripts.git',
    },
    'devDependencies': {
      'link-module-alias': '^1.2.0',
    },
    'author': '',
    'license': 'ISC',

  }, null, 4);

  fs.writeFile(outputFilename, json, 'utf8', (error) => {
    if (error) {
      next({ error });
    } else {
      spinner.indent = 1;
      spinner.info('package.json saved to ' + outputFilename);
      spinner.indent = 0;
      next();
    }
  });
};