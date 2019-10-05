const replace = require('replace-in-file');
const fs      = require('fs');

function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
    return index == 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, '');
}


function resolveWrapperRelativePath(componentType, isEjected, folderPath) {
  const type = componentType === 'page' ? 'pageWrapper' : 'componentWrapper';

  if (!isEjected) {
    return `@mooglee/core/wrappers/${type}`;
  } else {
    return folderPath.split('/')
      .map(() => '..')
      .join('/') + `/wrappers/${type}`
  }
}

function resolvePageLayoutRelativePath(isEjected, folderPath) {

  if (!isEjected) {
    return `@mooglee/core/components/PageLayout`;
  } else {
    return folderPath.split('/')
      .map(() => '..')
      .join('/') + `/components/PageLayout`
  }
}

function formatNamespaces(namespaces = '') {
  const _namespaces = namespaces
    .map(_n => `'${_n}'`)
    .join(', ')
  return`[${_namespaces}]`
}

/**
 * Defines all the template variables we should look for
 * and the value that should replace them
 * @param appConfig
 * @param appDetails
 */
function getReplacementConfig({
                                type,
                                name,
                                isConnected,
                                isTranslatable,
                                namespaces,
                                usePageData,
                                isEjectedApp,
                                folderPath,
                              }) {
  const replaceStack = [
    { from: /<<<COMPONENT_NAME>>>/g, to: camelize(name) },
    { from: /<<<IS_CONNECTED>>>/g, to: !!isConnected },
    { from: /<<<IS_TRANSLATABLE>>>/g, to: !!isTranslatable },
    { from: /<<<NAMESPACES>>>/g, to: formatNamespaces(namespaces) || '[]' },
    { from: /<<<PAGE_NAME>>>/g, to: name },
    { from: /<<<NO_PAGE_DATA>>>/g, to: !usePageData },
    { from: /<<<PAGE_DATA_RENDER_DEFINITION>>>/g, to: usePageData ? ', pageData' : '' },
    { from: /<<<PAGE_DATA_LAYOUT_DEFINITION>>>/g, to: usePageData ? ' pageData={pageData}' : '' },
    { from: /<<<WRAPPER_RELATIVE_PATH>>>/g, to: resolveWrapperRelativePath(type, isEjectedApp, folderPath) },
    { from: /<<<PAGE_LAYOUT_RELATIVE_PATH>>>/g, to: resolvePageLayoutRelativePath(isEjectedApp, folderPath) },
  ];


  return {
    from: replaceStack.map(_r => _r.from),
    to: replaceStack.map(_r => _r.to),
  };
}

/**
 * This action is charged of replacing some template variables in every project files with
 * the user configuration
 *
 * While it is not possible to do this with hidden file (e.q .env), all the env files should be renamed
 * at the end of the process
 * @param appPath
 * @param next
 * @param data
 */
module.exports = function ({ appPath }, next, data) {
  try {
    replace({
      files: data.filePath,
      ...getReplacementConfig(data),
    })
      .then(function (res) {
       next();
      })
      .catch(function (error) {
        next({ error });
      });

  } catch (error) {
    next({ error });
  }
};