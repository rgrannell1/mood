
/**
 * Typed wrapper for localstorage
 */
export const local = {
  /**
   * set a value in localstorage
   *
   * @param {string} key the property name
   * @param {string} value the property value
   */
  set(key, value) {
    return localStorage.setItem(key, JSON.stringify(value))
  },
  /**
 * set a value in localstorage
 *
 * @param {string} key the property name
 *
 * @returns {string} the value stored in localstorage
 */
  get(key) {
    return JSON.parse(localStorage.getItem(key))
  }
}

export async function registerServiceWorker() {
  try {
    const reg = await navigator.serviceWorker.register('./../service-worker.js')
    console.log(`registered service-worker: scope is ${reg.scope}`)
  } catch (err) {
    console.error(`failed to register service-worker: ${err.message}`)
  }
}

export const model = {
  event(elem) {
    return {
      type: 'select-emotion',
      mood: elem.title,
      timestamp: Date.now()
    }
  }
}

/**
 * Writes an event to a temporary cache, so that fetch requests can attempt to
 * send them to the server when a connection is available.
 *
 * @param event {Event} the event to write to the cache
 */
export function writeCache(event) {
  const currentCache = local.get('cached-events')

  if (!Array.isArray(currentCache)) {
    local.set('cached-events', [])
  }

  currentCache.push(event)
  console.log('pushed event to cache')
}

/**
 * Sends the events queued into the cache to the server for storage
 * when a connection is available.
 */
export async function syncData() {
  const reg = await navigator.serviceWorker.ready
  reg.sync.register('sync')
}
