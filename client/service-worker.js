/* eslint-env serviceworker */

const config = {
  cacheName: 'sw-cache'
}

const api = {}

// -- todo use an import here instead?
api.sendEvents = () => {
  const events = JSON.parse(localStorage.getItem('cached-events'))

  console.log(`sending ${events.length} events to server`)

  const body = JSON.stringify({ events }, null, 2)

  return fetch('api/save-mood', {
    method: 'POST',
    credentials: 'include',
    body
  })
}

// -- todo expand caceable
const cached = [
  '/',
  '/js/index.js',
  '/css/style.css',
  '/css/device-sizing.css',
  '/fonts/open-sans.woff2',
  '/favicon.ico',
  '/manifest.webmanifest',
  '/icons/icon-144x144.png',
  '/svg/atrocious.svg',
  '/svg/bad.svg',
  '/svg/decent.svg',
  '/svg/ennui.svg',
  '/svg/fine.svg',
  '/svg/in-pain.svg',
  '/svg/neutral.svg',
  '/svg/stellar.svg'
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
  const res = await fetch(event.request.clone(), {
    credentials: 'include'
  })

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

/*
// -- workaround for Chromium bug
if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
  return
}
*/

/**
 * Respond with a cached response if possible, but update to a
 * recent version of the resource.
 */
self.addEventListener('fetch', async event => {
  // -- fallback to network
  if (event.request.method !== 'GET') {
    return
  }

  event.respondWith(async function () {
    const cachedRes = await caches.match(event.request)

    if (cachedRes) {
      event.waitUntil(fetchUncachedResponse(event))

      return cachedRes
    }

    return fetchUncachedResponse(event)
  }())
})

// -- remove old caches, when needed
self.addEventListener('activate', () => {
  console.log('⛏ activated')
})

self.addEventListener('sync', event => {
  if (event.tag === 'sync') {
    event.waitUntil(api.sendEvents())
  } else {
    console.error('unknown event-request sent')
  }
})
