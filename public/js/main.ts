
import local from './local'

async function registerServiceWorker () {
  try {
    const reg = await navigator.serviceWorker.register('./../service-worker.js')
    console.log(`registered service-worker: scope is ${reg.scope}`)
  } catch (err) {
    console.error(`failed to register service-worker: ${err.message}`)
  }
}

type Mood = string

interface Event {
  type: 'select-emotion',
  mood: Mood
}

const model = {
  event (elem):Event {
    return {
      type: 'select-emotion',
      mood: elem.title
    }
  }
}

/**
 * Writes an event to a temporary cache, so that fetch requests can attempt to
 * send them to the server when a connection is available.
 *
 * @param event {Event} the event to write to the cache
 */
function writeCache (event:Event) {
  const currentCache:Array<Event> = local.get('cached-events')

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

  document.querySelectorAll('.mood').forEach((elem: HTMLElement) => {
    elem.onclick = async event => {
      const data = model.event(event.target)

      writeCache(data)
      await syncData()

    }
  })
}

main()
