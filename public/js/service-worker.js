
const cached = [
  '/'
]

const service = {}

service.install = async () => {
  const cache = await caches.open('sw-cache')
  await cache.addAll(cached)
  return self.skipWaiting()
}

service.fetch = async () => {
  const cachedRes = await caches.match(event.request)
  if (cachedRes) {
    return cachedRes
  }

  const uncachedRes = fetch(event.request)

  const isUncacheable = !uncachedRes || uncachedRes.status !== 200 || uncachedRes.type !== 'basic'
  if (isUncacheable) {
    return uncachedRes;
  }

  const toCache = uncachedRes.clone()
  const cache = await caches.open('sw-cache')
  cache.put(event.request, toCache)

  return uncachedRes
}

console.log(`⛏ service-worker started`)

self.addEventListener('install', event => {
  console.log('⛏ installed')

  event.waitUntil(service.install())
})

self.addEventListener('fetch', event => {
  const isSameOrigin = event.request.url.startsWith(self.location.origin)

  event.respondWith(service.fetch())

  console.log('⛏ fetch')
})

self.addEventListener('activate', event => {
  // -- remove old caches, when needed
  console.log('⛏ activated')
})

self.addEventListener('message', event => {
  console.log(`⛏ recieved message: ${event.data}`)
})
