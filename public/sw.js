importScripts('workbox-sw.prod.v2.1.2.js');

/**
 * DO NOT EDIT THE FILE MANIFEST ENTRY
 *
 * The method precache() does the following:
 * 1. Cache URLs in the manifest to a local cache.
 * 2. When a network request is made for any of these URLs the response
 *    will ALWAYS comes from the cache, NEVER the network.
 * 3. When the service worker changes ONLY assets with a revision change are
 *    updated, old cache entries are left as is.
 *
 * By changing the file manifest manually, your users may end up not receiving
 * new versions of files because the revision hasn't changed.
 *
 * Please use workbox-build or some other tool / approach to generate the file
 * manifest which accounts for changes to local files and update the revision
 * accordingly.
 */
const fileManifest = [
  {
    "url": "index.html",
    "revision": "55ff8ad8fd0a1dc1b061f7fa81824245"
  },
  {
    "url": "manifest.json",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "partials/addFridge.html",
    "revision": "7986dfa88cfe14b278b5dc638f54ab15"
  },
  {
    "url": "partials/myFridgeEmpty.html",
    "revision": "3b5fdc3899cc5cf6e818ee7f9fd54663"
  },
  {
    "url": "partials/myFridgeFull.html",
    "revision": "34601726f9a69b07e4c8854c6031c8f8"
  },
  {
    "url": "partials/setting.html",
    "revision": "5394b987e6fcfaa556f124f6959c610f"
  },
  {
    "url": "partials/storeaccounts.html",
    "revision": "59e4f0aebaf8fef15e2e2b7dee37f0cc"
  },
  {
    "url": "scripts/app.js",
    "revision": "5d3577dfc77d7e7db19704f10a6aaafb"
  },
  {
    "url": "scripts/example-app.js",
    "revision": "46f6d2ae5f9e65c7fda5d24ffc0b3a5b"
  },
  {
    "url": "styles/style.css",
    "revision": "06f211cf76c9f69e22d0b8952a204a46"
  }
];

const workboxSW = new self.WorkboxSW();
workboxSW.precache(fileManifest);
