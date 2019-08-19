
import {
  sendEvents
} from './ts/send-events'

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

// -- remove old caches, when needed
self.addEventListener('activate', () => {
  console.log('⛏ activated')
})

self.addEventListener('sync', (event:any) => {
  if (event.tag === 'sync') {
    event.waitUntil(sendEvents())
  }
})
