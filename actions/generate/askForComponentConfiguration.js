const prompts = require('prompts');
const path    = require('path');
const fs      = require('fs');


const getDirectories = source => {
  if (fs.existsSync(source)) {
    return fs.readdirSync(source, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
  }
  return [];
};


module.exports = function ({ argv, spinner, config, appPath }, next, data) {
  const isTranslatable = ((data.appConfig || {}).lang || {}).enabled;

  const questions = [
    {
      type: 'select',
      name: 'type',
      message: 'What would you like to generate ?',
      choices: [
        { title: 'Component', value: 'component' },
        { title: 'Page', value: 'page' },
      ],
      initial: (_, __, _this) => {
        const index = _this.choices.findIndex(_c => _c.value === argv.type) || 0;
        return index >= 0 ? index : 0;
      },
    },
    {
      type: 'toggle',
      name: 'useClass',
      message: 'What type of component do you prefer ?',
      initial: false,
      active: 'Class',
      inactive: 'Function',
    },
    {
      type: 'autocomplete',
      name: 'folderPath',
      message: (_, values) => `What folder should your ${values.type} live in ?`,
      initial: 0,
      choices: (_, values) => [
        { title: `${values.type}s/` },
      ],

      // Make autocomplete with app directories like a shell ;)
      suggest: (_input, choices) => {
        if (!_input || !_input.length) return choices;
        const directories    = getDirectories(path.join(appPath));

        let subDirectories = directories
          .filter(_dir => _dir && _input.length > 2 && _dir.indexOf(_input) >= 0)
          .map(_dir => getDirectories(path.join(appPath, _dir))
            .map(_sub => path.join(_dir, _sub)))

        if (subDirectories && subDirectories.length) {
          subDirectories = subDirectories.reduce((a, b) => a.concat(b));
        }

        return [...directories, ...subDirectories]
          .filter(_dir => _dir.indexOf(_input) >= 0)
          .map(title => ({ title }));
      },

    },
    {
      type: 'text',
      name: 'name',
      message: (_, values) => `What's your ${values.type} name ?`,
      initial: (_, values) => argv.name || (values.type === 'page' ? 'my-page' : 'MyComponent'),
    },

    // For components ONLY

    {
      type: (_, values) => values.type === 'component' && 'toggle',
      name: 'isConnected',
      message: 'Should your component be connected to Redux ?',
      initial: false,
      active: 'Yes',
      inactive: 'No',
    },
    {
      type: (_, values) => (values.type === 'component' && isTranslatable) && 'toggle',
      name: 'isTranslatable',
      message: 'Should your component be translatable (using the `t` function) ?',
      initial: false,
      active: 'Yes',
      inactive: 'No',
    },
    {
      type: (_, values) => (values.type === 'component' && values.isTranslatable) && 'list',
      name: 'namespaces',
      message: 'Do you wan\'t to define some custom namespaces for your component (separated with a \',\' ) ?',
      initial: '',
      separator: ',',
    },

    // For pages only
    {
      type: (_, values) => values.type === 'page' && 'toggle',
      name: 'usePageData',
      message: 'Will your page use any `pageData` ?',
      initial: true,
      active: 'Yes',
      inactive: 'No',
    },
    {
      type: (_, values) => values.type === 'page' && 'toggle',
      name: 'addRoute',
      message: 'Should we add the route to your routes file for you ?',
      initial: true,
      active: 'Yes',
      inactive: 'No',
    },
    {
      type: (_, values) => (values.type === 'page' && values.addRoute === true) && 'text',
      name: 'routePathname',
      message: 'What pathname should we use for that ?',
      initial: '/my-page',
    },
    {
      type: (_, values) => (values.type === 'page' && values.addRoute === true) && 'toggle',
      name: 'prefetchRoute',
      message: 'Should the route be pre-fetched ?',
      initial: false,
      active: 'Yes',
      inactive: 'No',
    },
    {
      type: (_, values) => (values.type === 'page' && values.addRoute === true) && 'toggle',
      name: 'neverCacheRoute',
      message: 'Should we prevent the route from being cached ?',
      initial: false,
      active: 'Yes',
      inactive: 'No',
    },

  ];

  spinner.stop();

  function onSubmit(prompt, answer, answers) {
    // Check that the component do not already exists
    if (prompt.name === 'name') {
      const { folderPath, name } = answers;
      const componentPath        = path.join(appPath, folderPath, (name + '.js'));

      if (fs.existsSync(componentPath)) {
        const error = 'The following file already exists : ' + componentPath;
        next({ error });
        return true;
      }
    }
  }


  prompts(questions, { onCancel: function () {process.exit(0);}, onSubmit }).then(function (res) {
    questions.forEach(function (_question) {
      if (res[_question.name] === undefined || res[_question.name] === null || res[_question.name] === '') {
        res[_question.name] = _question.initial;
      }

      if (questions.type === 'page') {
        spinner.info('You should restart your app at the end of the script in order to see your new page')
      }
    });
    Object.assign(data, res);
    next();
  });
};