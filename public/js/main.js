
import { render } from 'https://unpkg.com/lit-html@1.1.2/lit-html.js'

import local from './services/local.js'
import {
  renderMoodData
} from './services/mood-graph.js'

import {
  sendEvents
} from './services/send-events.js'

import pages from './view/pages.js'

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
  reg.sync.register('sync')
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

  renderMoodData(null, {})
}

main()

render(pages.index(), document.body)
