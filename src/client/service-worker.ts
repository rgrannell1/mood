
import local from './ts/local'

const cached:Array<string> = [
//  '/',
//  '/css/style.css',
//  '/js/main.js',
//  '/favicon.ico'
]

const install = async () => {
  const cache = await caches.open('sw-cache')
  await cache.addAll(cached)
  return (self as any).skipWaiting()
}

const fetchResponse = async (event:any) => {
  const cachedRes = await caches.match(event.request)
  if (cachedRes) {
    return cachedRes
  }

  const uncachedRes = await fetch(event.request)

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

self.addEventListener('install', (event: any) => {
  console.log('⛏ installed')

  event.waitUntil(install())
})

self.addEventListener('fetch', (event: any) => {
  event.respondWith(fetchResponse(event))

  console.log('⛏ fetch')
})

self.addEventListener('activate', () => {
  // -- remove old caches, when needed
  console.log('⛏ activated')
})

async function sendEvents () {
  // generate a body from data in localstorage and send it on

  console.log(`⛏ syncing events to server`)
  const events:Array<any> = local.get('cached-events')

  const body = JSON.stringify({ events }, null, 2)

  return fetch('URL', {
    method: 'POST',
    body
  })
}

self.addEventListener('sync', (event:any) => {
  if (event.tag === 'sync') {
    event.waitUntil(sendEvents())
  }
})
