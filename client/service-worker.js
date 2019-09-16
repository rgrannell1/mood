/* eslint-env serviceworker */

const config = {
  cacheName: 'sw-cache'
}

const api = {}

// -- todo use an import here instead?
api.sendEvents = () => {
  const events = JSON.parse(localStorage.getItem('cached-events'))
  console.log(`⛏ syncing ${events.length} events to server`)

  const body = JSON.stringify({ events }, null, 2)

  return fetch('api/save-mood', {
    method: 'POST',
    body
  })
}

// -- todo expand caceable
const cached = [
  '/',
  '/js/pages/index.js',
  '/css/style.css',
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

/**
 * Fetch an uncached version of a request from a server and store it
 * if the request succeeds.
 *
 * @param {Event} event
 */
const fetchUncachedResponse = async event => {
  const res = await fetch(event.request.clone())

  const isCacheable = res &&
    res.status === 200 &&
    res.type === 'basic' &&
    event.request.method === 'GET'

  if (isCacheable) {
    const toCache = res.clone()
    const cache = await caches.open(config.cacheName)
    cache.put(event.request, toCache)
  }

  return res
}

console.log('⛏ service-worker started')

self.addEventListener('install', event => {
  console.log('⛏ installed')

  event.waitUntil(install())
})

/**
 * Respond with a cached response if possible, but update to a
 * recent version of the resource.
 */
self.addEventListener('fetch', async event => {
  const cachedRes = await caches.match(event.request)

  if (cachedRes) {
    event.waitUntil(fetchUncachedResponse(event))
    event.respondWith(cachedRes)
  } else {
    event.respondWith(fetchUncachedResponse(event))
  }
})

// -- remove old caches, when needed
self.addEventListener('activate', () => {
  console.log('⛏ activated')
})

self.addEventListener('sync', event => {
  if (event.tag === 'sync') {
    event.waitUntil(api.sendEvents())
  }
})
