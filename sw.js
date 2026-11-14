const CACHE_NAME = 'upkk-v2-security-static-only-20261115';
const urlsToCache = ["./","./index.html","./parent-existing-2027-config.js","./parent-existing-2027.js","./assets/branding/portal-logo.png","./manifest.json","./icons/icon-72.png","./icons/icon-96.png","./icons/icon-128.png","./icons/icon-144.png","./icons/icon-152.png","./icons/icon-192.png","./icons/icon-192-maskable.png","./icons/icon-384.png","./icons/icon-512.png","./icons/icon-512-maskable.png"];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(urlsToCache)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

// Explicit allowlist: only same-origin, non-parameterised static resources.
// Never cache identity, payment, receipts, GAS requests or personalised responses.
const STATIC_PATHS = new Set(
  urlsToCache.map(path => new URL(path, self.registration.scope).pathname)
);
self.addEventListener('fetch', e => {
  const request = e.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  const eligible = url.origin === self.location.origin &&
    !url.search && !url.hash &&
    STATIC_PATHS.has(url.pathname);

  if (!eligible) {
    // Do not intercept or cache unlisted, dynamic or cross-origin requests.
    return;
  }

  e.respondWith(
    fetch(request).then(response => {
      const cacheControl = response.headers.get('Cache-Control') || '';
      if (response.ok && response.type === 'basic' &&
          !/\b(?:private|no-store)\b/i.test(cacheControl)) {
        const copy = response.clone();
        e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.put(request, copy)));
      }
      return response;
    }).catch(() => caches.match(request))
  );
});
