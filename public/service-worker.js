
const local = {
  set (key, value) {
    return localStorage.setItem(key, JSON.stringify(value))
  },
  get (key) {
    return JSON.parse(localStorage.getItem(key))
  }
}

async function sendEvents () {
  const events = local.get('cached-events')
  console.log(`⛏ syncing ${events.length} events to server`)

  const body = JSON.stringify({ events }, null, 2)

  return fetch('api/save-mood', {
    method: 'POST',
    body
  })
}

const cached = [
  '/',
  '/css/style.css',
  '/js/main.js',
  '/js/services/local.js',
  '/js/services/send-events.js',
  '/fonts/open-sans.woff2',
  '/favicon.ico',
  '/manifest.webmanifest',
  '/icons/icon-144x144.png'
]

const install = async () => {
  const cache = await caches.open('sw-cache')
  await cache.addAll(cached)
  return self.skipWaiting()
}

const fetchResponse = async event => {
  const cachedRes = await caches.match(event.request)
  if (cachedRes) {
    return cachedRes
  }

  const uncachedRes = await fetch(event.request)

  const isUncacheable = !uncachedRes ||
    uncachedRes.status !== 200 ||
    uncachedRes.type !== 'basic' ||
    event.request.method !== 'GET'

  if (isUncacheable) {
    return uncachedRes
  }

  const toCache = uncachedRes.clone()
  const cache = await caches.open('sw-cache')
  cache.put(event.request, toCache)

  return uncachedRes
}

console.log('⛏ service-worker started')

self.addEventListener('install', event => {
  console.log('⛏ installed')

  event.waitUntil(install())
})

self.addEventListener('fetch', event => {
  event.respondWith(fetchResponse(event))

  console.log('⛏ fetch')
})

// -- remove old caches, when needed
self.addEventListener('activate', () => {
  console.log('⛏ activated')
})

self.addEventListener('sync', event => {
  if (event.tag === 'sync') {
    event.waitUntil(sendEvents())
  }
})
