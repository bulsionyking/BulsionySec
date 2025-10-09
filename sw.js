const CACHE_NAME = 'bulsionysec-v1';
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './styles.css',
  "./app.webmanifest',
  './icon-512x512.png',
  './icon-192x192.png'
];

// Install: pre-cache core resources
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .catch(err => console.error('Precache failed:', err))
  );
});

// Activate: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
  self.clients.claim();
});

// Fetch: network-first for API/XHR, cache-first for static assets
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Use network-first for same-origin navigation (so content updates)
  if (event.request.mode === 'navigate' || (event.request.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then(resp => {
          // Update cache with fresh HTML
          const respClone = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, respClone));
          return resp;
        })
        .catch(() => caches.match('/index.html')) // fallback to cached shell
    );
    return;
  }

  // For static resources: cache-first
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request)
        .then(res => {
          // Put a copy in cache
          const resClone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
          return res;
        })
        .catch(() => {
          // optional fallback for images
          if (event.request.destination === 'image') {
            return caches.match('/icon-192x192.png');
          }
        });
    })
  );
});                 
