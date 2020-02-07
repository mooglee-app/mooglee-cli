const fs   = require('fs');
const path = require('path');


module.exports = function ({ appPath, spinner }, next, data) {
  const outputFilename = path.resolve(path.join(appPath, 'package.json'));
  const json           = JSON.stringify({
    'name': data.appDetails.name.replace(/ /, '-'),
    'version': data.appDetails.version,
    'description': data.appDetails.description || 'A web application built with React and Next.js',
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
      '@material-ui/core': '^4.9.1',
      '@material-ui/icons': '^4.9.1',
      '@material-ui/styles': '^4.9.0',
      '@mooglee/core': 'mooglee-app/mooglee-scripts#master',
      'classnames': '^2.2.6',
      'germaine': '^1.0.4',
      'jest': '^24.8.0',
      'jss': '^10.0.4',
      'next-offline': '^4.0.2',
      'pm2': '^4.2.3',
      'prop-types': '^15.7.2',
      'react': '^16.8.6',
      'react-dom': '^16.8.6',
      'react-inspector': '^4.0.0',
      'react-jss': '^10.0.4',
      'react-no-ssr': '^1.1.0',
      'url-join': '^4.0.1'
    },
    'author': '',
    'license': 'MIT',

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
