self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('stratum-cache-v1').then((cache) => {
      return cache.addAll(['/', '/index.html']);
    })
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(async (error) => {
        const response = await caches.match(e.request);
        if (response) return response;
        throw error;
      })
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
