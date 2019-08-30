
import local from './local.js'
import {
  renderMoodData
} from './mood-graph.js'

import {
  sendEvents
} from './send-events.js'

import { html, render } from 'https://unpkg.com/lit-html@1.1.2/lit-html.js'

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

  renderMoodData(null, {})
}

main()

const components = {}

components.page = main => {
  return html`
  <div class="grid-container">
    ${components.header()}
    <main>
    ${main}
    </main>
  </div>
  `
}

components.header = () => {
  return html`
  <header>
    <nav id="mood-header">
      <h1 id="brand">mood.</h1>
      <div id="google-signin" class="g-signin2" data-onsuccess="onSignIn"></div>
      </nav>
  </header>
  `
}

components.sectionHeader = title => {
  return html`<h2 class="mood-h2">${title}</h2>`
}

components.moodGraph = () => {
  return html`
  <section id="mood-graph" class="mood-panel">
    ${components.sectionHeader('Mood over time')}
    <canvas id="mood-over-time"></canvas>
  </section>`
}

components.moodPanel = () => {
  return html`
  <section id="mood-box" class="mood-panel">
  ${components.sectionHeader('How are you?')}
  <div class="emoji-container">
      <div id="mood-0" class="mood-emotion" title="Atrocious">💀</div>
      <div id="mood-1" class="mood-emotion" title="In pain">😩</div>
      <div id="mood-2" class="mood-emotion" title="Ennui">😔</div>
      <div id="mood-3" class="mood-emotion" title="Bad">😑</div>
      <div id="mood-4" class="mood-emotion" title="Neutral">😐</div>
      <div id="mood-5" class="mood-emotion" title="Decent">🙂</div>
      <div id="mood-6" class="mood-emotion" title="Fine">😊</div>
      <div id="mood-7" class="mood-emotion" title="Stellar">😇</div>
    </div>
  </section>
  `
}

const pages = {}

pages.index = () => {
  const indexMain = html`
    ${components.moodPanel()}
    ${components.moodGraph()}
  `
  return components.page(indexMain)
}

render(pages.index(), document.body)
