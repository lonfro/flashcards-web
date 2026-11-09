// Self-Destruct / Clean Service Worker to clear any stale cache on iOS / WebKit
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    self.registration
      .unregister()
      .then(() => {
        if (typeof self !== 'undefined' && 'caches' in self && self.caches) {
          return self.caches.keys().then((keys) => Promise.all(keys.map((k) => self.caches.delete(k))));
        }
      })
      .catch(() => {})
  );
  self.clients.claim();
});
