const CACHE_NAME = 'upkk-v2-rc1-admin-sidebar-fixed-20261114';
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

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);
  if (url.pathname.endsWith('/version.json')) {
    e.respondWith(fetch(e.request, { cache: 'no-store' }));
    return;
  }

  e.respondWith(
    fetch(e.request).then(r => {
      const copy = r.clone();
      caches.open(CACHE_NAME).then(c => c.put(e.request, copy));
      return r;
    }).catch(() => caches.match(e.request))
  );
});
