
import { render } from 'https://unpkg.com/lit-html@1.1.2/lit-html.js'

import {
  renderMoodData
} from '../services/mood-graph.js'

import {
  sendEvents
} from '../services/send-events.js'

import pages from '../view/pages.js'

import {
  registerServiceWorker,
  model,
  syncData
} from '../shared/utils.js'

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
