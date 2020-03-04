const replace = require('replace-in-file');
const path    = require('path');

/**
 * Defines all the template variables we should look for
 * and the value that should replace them
 * @param appConfig
 */
function getReplacementConfig({
                                name,
                                routePathname,
                                fileRelativePath,
                                neverCacheRoute,
                                prefetchRoute,
                              }) {
  const path = fileRelativePath
    .replace('/pages', '')
    .replace('.js', '');

  let replaceStack = [
    {
      from: /module.exports = {/g, to: `
module.exports = {
  '${routePathname}': { page: '${path}', prefetch: ${prefetchRoute}, neverCache: ${neverCacheRoute} },`,
    },
  ];

  return {
    from: replaceStack.map(_r => _r.from),
    to: replaceStack.map(_r => _r.to),
  };
}


module.exports = function ({ appPath }, next, data) {
  if (data.type !== 'page' || !data.addRoute) {
    return next();
  }

  try {
    replace({
      files: path.join(appPath, `routes.js`),
      ...getReplacementConfig(data),
    })
      .then(function () {
        next();
      })
      .catch(function (error) {
        next({ error });
      });

  } catch (error) {
    next({ error });
  }
};
