
const cached = [
//  '/',
//  '/css/style.css',
//  '/js/main.js',
//  '/favicon.ico'
]

const service = {}

service.install = async () => {
  const cache = await caches.open('sw-cache')
  await cache.addAll(cached)
  return self.skipWaiting()
}

service.fetch = async event => {
  const cachedRes = await caches.match(event.request)
  if (cachedRes) {
    return cachedRes
  }

  const uncachedRes = fetch(event.request)

  const isUncacheable = !uncachedRes || uncachedRes.status !== 200 || uncachedRes.type !== 'basic'
  if (isUncacheable) {
    return uncachedRes
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

  event.respondWith(service.fetch(event))

  console.log('⛏ fetch')
})

self.addEventListener('activate', event => {
  // -- remove old caches, when needed
  console.log('⛏ activated')
})

self.addEventListener('message', event => {
  console.log(`⛏ recieved message: ${event.data}`)
})

async function sendEvents () {
  // generate a body from data in localstorage and send it on

  console.log(`⛏ syncing events`)
}

self.addEventListener('sync', function (event) {
  if (event.tag == 'sync') {
    event.waitUntil(sendEvents())
  }
})
