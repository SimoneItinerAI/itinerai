self.addEventListener('install', (event) => {
  event.waitUntil(caches.open('itinerai-v1').then((cache) => cache.addAll(['/','/index.html'])))
})
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((resp) => resp || fetch(event.request).then((response) => {
      const copy = response.clone()
      caches.open('itinerai-v1').then((cache) => cache.put(event.request, copy))
      return response
    }).catch(() => resp))
  )
})
