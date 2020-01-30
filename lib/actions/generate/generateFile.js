const path   = require('path');
const ncp    = require('ncp');
const mkdirp = require('mkdirp');

const templates = {
  page: {
    class: path.resolve(__dirname, '../../templates/ClassPage.js.template'),
    func: path.resolve(__dirname, '../../templates/FunctionalPage.js.template'),
  },
  component: {
    class: path.resolve(__dirname, '../../templates/ClassComponent.js.template'),
    func: path.resolve(__dirname, '../../templates/FunctionalComponent.js.template'),
  },
};

module.exports = function ({ appPath, spinner }, next, data) {
  const {
          type,
          useClass,
          folderPath,
          name,
        } = data;

  // Resolve the file template path
  const templatePath = (templates[type] || {})[useClass ? 'class' : 'func'];

  if (!templatePath) {
    return next({ error: `No template have been found to generate your file.` });
  }

  const fileExtension = templatePath
    .replace('.template', '')
    .split('.')
    .pop();

  data.fileRelativePath = path.join(folderPath, `${name}.${fileExtension}`);
  data.filePath         = path.join(appPath, folderPath, `${name}.${fileExtension}`);

  spinner.info(path.join(appPath, folderPath));
  mkdirp.sync(path.join(appPath, folderPath));
  ncp(templatePath, data.filePath, function (error) {
    if (error) {
      return next({ error });
    } else {
      next();
    }
  });
};
