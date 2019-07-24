const fs   = require('fs');
const path = require('path');


module.exports = function (appName, dirPath) {
  const outputFilename = path.resolve(path.join(dirPath, 'package.json'));
  const json           = JSON.stringify({
    'name': appName,
    'version': '1.0.0',
    'description': 'A web application built with React and NextJs',
    'scripts': {
      'test': 'echo "Error: no test specified" && exit 1',
      'postinstall': 'link-module-alias',
    },
    '_moduleAliases': {
      '@mooglee/server': '../../mooglee-scripts/server',
    },
    'dependencies': {
      'mnra-scripts': 'git+ssh://git@github.com/chuck-durst/mnra-scripts.git',
    },
    "devDependencies": {
      "link-module-alias": "^1.2.0"
    },
    'author': '',
    'license': 'ISC',

  }, null, 4);

  fs.writeFile(outputFilename, json, 'utf8', (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('package.json saved to ' + outputFilename);
    }
  });
};