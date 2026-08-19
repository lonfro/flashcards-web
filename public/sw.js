const CACHE_NAME = 'flashcards-pwa-v2';

const STATIC_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
  '/favicon.png',
];

// Helper to check if Cache Storage is available in the current context
function isCacheAvailable() {
  try {
    return typeof self !== 'undefined' && 'caches' in self && self.caches !== undefined;
  } catch (e) {
    return false;
  }
}

// Install Event: Pre-cache static core assets
self.addEventListener('install', (event) => {
  if (!isCacheAvailable()) return;

  event.waitUntil(
    self.caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .catch((err) => console.warn('[SW] Pre-cache skipped:', err))
  );
  self.skipWaiting();
});

// Activate Event: Clear older caches safely
self.addEventListener('activate', (event) => {
  if (!isCacheAvailable()) return;

  event.waitUntil(
    self.caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => {
            if (name !== CACHE_NAME) {
              return self.caches.delete(name);
            }
          })
        );
      })
      .catch((err) => console.warn('[SW] Cache cleanup skipped:', err))
  );
  self.clients.claim();
});

// Fetch Event: Robust with try-catch and safe fallbacks
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // 1. If Cache API is not supported or available, bypass entirely
  if (!isCacheAvailable()) {
    return;
  }

  // 2. Ignore non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // 3. Ignore Google Drive API, OAuth, Next.js internal/HMR dev requests
  const url = request.url;
  if (
    !url.startsWith('http') ||
    url.includes('_next/webpack') ||
    url.includes('__nextjs') ||
    url.includes('googleapis.com') ||
    url.includes('accounts.google.com')
  ) {
    return;
  }

  // Navigation requests: Network first, fall back to cached index
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            self.caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {});
          }
          return response;
        })
        .catch(() => {
          return self.caches.match(request).then((cached) => cached || self.caches.match('/'));
        })
    );
    return;
  }

  // Static Assets: Cache first, network fallback with silent error recovery
  event.respondWith(
    self.caches
      .match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request)
          .then((networkResponse) => {
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            const responseToCache = networkResponse.clone();
            self.caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache)).catch(() => {});
            return networkResponse;
          })
          .catch(() => {
            return new Response('', { status: 408, statusText: 'Offline' });
          });
      })
      .catch(() => {
        return fetch(request);
      })
  );
});
