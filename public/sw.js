self.addEventListener('install', (event) => {
  event.waitUntil(caches.open('itinerai-v1').then((cache) => cache.addAll(['/','/index.html'])))
})
self.addEventListener('fetch', (event) => {
  const req = event.request
  const url = req.url || ''
  const isHttp = /^https?:/i.test(url)
  const isGet = req.method === 'GET'
  if (!isHttp || !isGet) {
    event.respondWith(fetch(req).catch(() => caches.match(req)))
    return
  }
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached
      return fetch(req).then((response) => {
        const copy = response.clone()
        caches.open('itinerai-v1').then((cache) => {
          try { cache.put(req, copy) } catch { /* ignore non-storable */ }
        })
        return response
      }).catch(() => cached)
    })
  )
})
