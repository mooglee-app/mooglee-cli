const replace = require('replace-in-file');
const fs      = require('fs');

function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
    return index == 0 ? word.toLowerCase() : word.toUpperCase();
  })
    .replace(/\s+/g, '')
    .replace(/-/, '');
}


/**
 * Resolve the wrapper relative path
 * @param componentType
 * @param isEjected
 * @param folderPath
 * @returns {string}
 */
function resolveWrapperRelativePath(componentType, isEjected, folderPath) {
  const type = componentType === 'page' ? 'pageWrapper' : 'componentWrapper';

  if (!isEjected) {
    return `@mooglee/core/wrappers/${type}`;
  } else {
    return folderPath.split('/')
      .map(() => '..')
      .join('/') + `/wrappers/${type}`;
  }
}

/**
 * Resolve the PageLayout.js relative path
 * @param isEjected
 * @param folderPath
 * @returns {string}
 */
function resolvePageLayoutRelativePath(isEjected, folderPath) {

  if (!isEjected) {
    return `@mooglee/core/components/PageLayout`;
  } else {
    return folderPath.split('/')
      .map(() => '..')
      .join('/') + `/components/PageLayout`;
  }
}

/**
 * Format the namespaces list (add quotes)
 * @param namespaces
 * @returns {string|null}
 */
function formatNamespaces(namespaces = []) {
  if (!Array.isArray(namespaces)) return null;
  const _namespaces = namespaces
    .map(_n => `'${_n}'`)
    .join(', ');
  return `[${_namespaces}]`;
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
  let replaceStack = [
    { from: /<<<COMPONENT_NAME>>>/g, to: camelize(name) },
    { from: /<<<WRAPPER_RELATIVE_PATH>>>/g, to: resolveWrapperRelativePath(type, isEjectedApp, folderPath) },
  ];

  if (type === 'component') {
    replaceStack = replaceStack.concat([
      { from: /<<<IS_CONNECTED>>>/g, to: !!isConnected },
      { from: /<<<IS_TRANSLATABLE>>>/g, to: !!isTranslatable },
      { from: /<<<NAMESPACES>>>/g, to: formatNamespaces(namespaces) || '[]' },
    ]);
  } else {
    replaceStack = replaceStack.concat([
      { from: /<<<PAGE_NAME>>>/g, to: name },
      { from: /<<<NO_PAGE_DATA>>>/g, to: !usePageData },
      { from: /<<<PAGE_DATA_RENDER_DEFINITION>>>/g, to: usePageData ? ', pageData' : '' },
      { from: /<<<PAGE_DATA_LAYOUT_DEFINITION>>>/g, to: usePageData ? ' pageData={pageData}' : '' },
      { from: /<<<PAGE_LAYOUT_RELATIVE_PATH>>>/g, to: resolvePageLayoutRelativePath(isEjectedApp, folderPath) },
    ]);
  }

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