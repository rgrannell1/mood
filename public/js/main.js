
import local from './local.js'
import {
  sendEvents
} from './send-events.js'

async function registerServiceWorker () {
  try {
    const reg = await navigator.serviceWorker.register('./../service-worker.js')
    console.log(`registered service-worker: scope is ${reg.scope}`)
  } catch (err) {
    console.error(`failed to register service-worker: ${err.message}`)
  }
}

const model = {
  event (elem) {
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
function writeCache (event) {
  const currentCache = local.get('cached-events')

  if (!Array.isArray(currentCache)) {
    console.error('invalid cached-events list; writing an empty array to cache')
    local.set('cached-events', [])
  }

  currentCache.push(event)
  console.log('pushed event to cache')
}

/**
 * Sends the events queued into the cache to the server for storage
 * when a connection is available.
 */
async function syncData () {
  const reg = await navigator.serviceWorker.ready
  reg.sync.register('sync');
}

/**
 * Run the client-side code
 */
async function main () {
  await registerServiceWorker()

  const $moods = document.querySelectorAll('.mood-emotion')

  $moods.forEach(elem => {
    elem.onclick = async event => {

      const data = model.event(event.target)
      writeCache(data)

      try {
        await sendEvents()
      } catch (err) {
        console.error(`failed to send events: ${err.message}`)
        await syncData()
      }
    }
  })
}

main()
