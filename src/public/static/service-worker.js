self.__precacheManifest = [
  {
    "url": "/_next/static/chunks/0.js",
    "revision": "4222b32e7c2ebb5c96be"
  },
  {
    "url": "/_next/static/chunks/styles.js",
    "revision": "c6d9d46ee6c16187b848"
  },
  {
    "url": "/_next/static/css/styles.chunk.css",
    "revision": "c6d9d46ee6c16187b848"
  },
  {
    "url": "/_next/static/development/dll/dll_611000b538fd9c8742ec.js",
    "revision": "7c63d7377fe0db54c9f29746ac34d549"
  },
  {
    "url": "/_next/static/development/pages/_app.js",
    "revision": "8d7e6d949e689c93534c"
  },
  {
    "url": "/_next/static/development/pages/_error.js",
    "revision": "e97216efa54c75d52c16"
  },
  {
    "url": "/_next/static/runtime/amp.js",
    "revision": "917ca3f4a1595ff43bca"
  },
  {
    "url": "/_next/static/runtime/main.js",
    "revision": "9bea8a083b5939f8da6a"
  },
  {
    "url": "/_next/static/runtime/webpack.js",
    "revision": "0bc10a9d2a7cf443b366"
  },
  {
    "url": "/_next/static/webpack/801c0da4865382258937.hot-update.json",
    "revision": "c9eee44085a6eea054471a79f760b1b2"
  },
  {
    "url": "/_next/static/webpack/static/development/pages/_error.js.801c0da4865382258937.hot-update.js",
    "revision": "e97216efa54c75d52c16"
  }
];

/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

importScripts(
  
);

workbox.core.skipWaiting();

workbox.core.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/(http[s]?:\/\/.*\.(?:png|jpg|jpeg|svg))/, new workbox.strategies.CacheFirst({ "cacheName":"images", plugins: [] }), 'GET');
workbox.routing.registerRoute(/\.(?:woff|woff2|otf|ttf)$/, new workbox.strategies.CacheFirst({ "cacheName":"fonts", plugins: [] }), 'GET');
workbox.routing.registerRoute(/\.(?:js|jsx)$/, new workbox.strategies.NetworkFirst({ "cacheName":"scripts", plugins: [] }), 'GET');
workbox.routing.registerRoute(/http[s]?:\/\/.*/, new workbox.strategies.NetworkFirst({ "cacheName":"html-cache", plugins: [] }), 'GET');
