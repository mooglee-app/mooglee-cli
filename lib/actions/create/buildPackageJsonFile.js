const fs   = require('fs');
const path = require('path');


module.exports = function ({ appPath, spinner }, next, data) {
  const outputFilename = path.resolve(path.join(appPath, 'package.json'));
  const json           = {
    'name': data.appConfig.name.replace(/ /, '-'),
    'version': data.appConfig.version,
    'description': data.appConfig.description || 'A web application built with React and Next.js',
    '_isMoogleeApp': true,
    'scripts': {
      'dev': 'NODE_ENV=development node node_modules/@mooglee/core/scripts/start.js',
      'build': 'NODE_ENV=production next build',
      'start': 'NODE_ENV=production node node_modules/@mooglee/core/scripts/start.js',
      'eject': 'node node_modules/@mooglee/core/scripts/eject.js',
      'heroku-postbuild': 'npm run build',
      'test': 'echo "Error: no test specified" && exit 1',
    },
    'dependencies': {
      '@material-ui/core': '^4.11.3',
      '@material-ui/icons': '^4.11.2',
      '@material-ui/styles': '^4.11.3',
      '@mooglee/core': 'mooglee-app/mooglee-scripts#feature/1.3.0',
      'classnames': '^2.3.1',
      'jest': '^26.6.3',
      'next-i18next': '^8.1.3',
      'prop-types': '^15.7.2',
      'react': '^17.0.2',
      'react-dom': '^17.0.2',
      'react-i18next': '^11.8.13',
      'react-inspector': '5.1.0',
      'url-join': '^4.0.1',
      'webpack': '^4.46.0',
    },
    'author': '',
    'license': 'MIT',

  };

  fs.writeFile(outputFilename, JSON.stringify(json, null, 4), 'utf8', (error) => {
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
