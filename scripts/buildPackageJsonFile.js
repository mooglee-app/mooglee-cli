const fs   = require('fs');
const path = require('path');


module.exports = function ({ appName, appPath, spinner }, next) {
  const outputFilename = path.resolve(path.join(appPath, 'package.json'));
  const json           = JSON.stringify({
    'name': appName,
    'version': '1.0.0',
    'description': 'A web application built with React and NextJs',
    'scripts': {
      'dev': 'NODE_ENV=development node index.js',
      'build': 'NODE_ENV=production next build',
      'start': 'NODE_ENV=production node index.js',
      'heroku-postbuild': 'npm run build',
      'test': 'echo "Error: no test specified" && exit 1',
      'postinstall': 'link-module-alias',
    },
    '_moduleAliases': {
      'mooglee': '../../mooglee-scripts',
    },
    'dependencies': {
      '@babel/core': '^7.5.4',
      '@material-ui/core': '^4.2.1',
      '@material-ui/icons': '^4.2.1',
      '@material-ui/styles': '^4.2.1',
      '@zeit/next-sass': '^1.0.1',
      'autoprefixer': '^9.6.1',
      'axios': '^0.19.0',
      'babel-core': '^7.0.0-bridge.0',
      'babel-jest': '^24.8.0',
      'babel-plugin-transform-remove-console': '^6.9.4',
      'chalk': '^2.4.2',
      'classnames': '^2.2.6',
      'deep-equal': '^1.0.1',
      'deepmerge': '^4.0.0',
      'enzyme': '^3.10.0',
      'enzyme-adapter-react-16': '^1.14.0',
      'es7-object-polyfill': '1.0.0',
      'eslint': '^6.0.1',
      'eslint-loader': '^2.2.1',
      'extract-text-webpack-plugin': '^4.0.0-beta.0',
      'file-loader': '^4.0.0',
      'fileloader': '^2.0.0',
      'germaine': '^1.0.4',
      'html-loader': '^0.5.5',
      'html-webpack-plugin': '^3.2.0',
      'isomorphic-fetch': '^2.2.1',
      'jest': '^24.8.0',
      'jss': '^9.8.7',
      'jss-compose': '^5.0.0',
      'keycode': '^2.2.0',
      'next': '^9.0.2',
      'next-i18next': '^0.47.0',
      'next-offline': '^4.0.2',
      'next-redux-wrapper': '^3.0.0-alpha.3',
      'next-workbox-webpack-plugin': '^1.1.0',
      'node-sass': '^4.12.0',
      'nprogress': '^0.2.0',
      'pm2': '^3.5.1',
      'postcss-import': '^12.0.1',
      'postcss-loader': '^3.0.0',
      'postcss-sass': '^0.4.1',
      'precss': '^4.0.0',
      'prop-types': '^15.7.2',
      'qs': '^6.7.0',
      'react': '^16.8.6',
      'react-dev-utils': '^9.0.1',
      'react-dom': '^16.8.6',
      'react-inspector': '^2.3.1',
      'react-jss': '^8.6.1',
      'react-no-ssr': '^1.1.0',
      'react-redux': '^7.1.0',
      'recompose': '^0.30.0',
      'redux': '^4.0.4',
      'redux-localstorage-simple': '^2.1.6',
      'redux-logger': '^3.0.6',
      'redux-thunk': '^2.3.0',
      'style-loader': '^0.23.1',
      'url-join': '^4.0.1',
      'url-loader': '^2.0.1',
      'webpack-visualizer-plugin': '^0.1.11',
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