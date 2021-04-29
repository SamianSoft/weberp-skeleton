const CACHE_NAME = 'iMaster-cache-v1';

self.addEventListener('install', function(event) {
  //dont cache all request
  // event.waitUntil(
  //   caches.open(CACHE_NAME).then(function(cache) {
  //     return cache.addAll([
  //       '/v2/meta/',
  //     ]);
  //   })
  // );
});

self.addEventListener('fetch', function(event) {
  if (!event.request.url.includes('/meta/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function(response) {
      // caches.match() always resolves
      // but in case of success response will have value
      if (response !== undefined) {
        return response;
      } else {
        return fetch(event.request)
          .then(function(response) {
            // response may be used only once
            // we need to save clone to put one copy in cache
            // and serve second one
            const responseClone = response.clone();

            caches.open(CACHE_NAME).then(function(cache) {
              cache.put(event.request, responseClone);
            });
            return response;
          })
          .catch(function() {
            console.log('error in fetch cache');
          });
      }
    }),
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (CACHE_NAME !== cacheName && cacheName.startsWith('iMaster-cache')) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});
