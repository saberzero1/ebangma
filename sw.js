var APP_PREFIX = 'EmileBangmaPortfolio_';     // Identifier for this app (this needs to be consistent across every cache update)
var VERSION = 'version_14';                   // Version of the off-line cache (change this value everytime you want to update cache)
var CACHE_NAME = APP_PREFIX + VERSION;
var URLS = [                                  // Add URL you want to cache in this list.                                  // If you have separate JS/CSS files,
  '/style/style.min.css',
  '/style/after.min.css',
  '/index.html',                              // add path to those files here
  '/manifest.webmanifest',
  '/media/emile-small.webp',
  '/fonts/fontawesome-webfont.woff2?v=4.7.0'
];

// Respond with cached resources
self.addEventListener('fetch', function (e) {
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (!request) // if cache is available, respond with cache
        return fetch(e.request);
      return request;
    })
  );
});

// Cache resources
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(URLS);
    })
  );
});

// Delete outdated caches
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      // `keyList` contains all cache names under your username.github.io
      // filter out ones that has this app prefix to create white list
      var cacheWhitelist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      });
      // add current cache name to white list
      cacheWhitelist.push(CACHE_NAME);

      return Promise.all(keyList.map(function (key, i) {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(keyList[i]);
        }
      }));
    })
  );
});