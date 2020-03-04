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
      '@material-ui/core': '^4.9.1',
      '@material-ui/icons': '^4.9.1',
      '@material-ui/styles': '^4.9.0',
      '@mooglee/core': 'mooglee-app/mooglee-scripts#master',
      'classnames': '^2.2.6',
      'jest': '^25.1.0',
      'jss': '^10.0.4',
      'prop-types': '^15.7.2',
      'react': '^16.8.6',
      'react-dom': '^16.8.6',
      'react-inspector': '2.2.2',
      'react-jss': '^10.0.4',
      'react-no-ssr': '^1.1.0',
      'url-join': '^4.0.1',
    },
    'author': '',
    'license': 'MIT',

  };

  if (data.appConfig.enableJsonServer === true) {
    json.dependencies['json-server'] = '^0.16.0';
    json.scripts['json-server:dev']  = 'NODE_ENV=development node ./json-server/start-json-server';
    json.scripts['json-server:prod'] = 'NODE_ENV=production node ./json-server/start-json-server';
  }

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
