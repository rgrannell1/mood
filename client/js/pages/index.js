
import { render } from 'lit-html'

import { renderMoodData } from '../services/mood-graph.js'
import { api } from '../services/api.js'
import cache from '../services/cache.js'
import { addLogin } from '../services/login.js'

import pages from '../view/pages.js'

import {
  registerServiceWorker,
  model,
  syncData
} from '../shared/utils.js'

/**
 * Run the client-side code
 */
async function main() {
  await registerServiceWorker()

  const $moods = document.querySelectorAll('.mood-emotion')

  $moods.forEach(elem => {
    elem.onclick = async event => {
      const data = model.event(event.target)
      cache.addEvent(data)

      try {
        await api.moods.post()
      } catch (err) {
        console.error(`failed to send events: ${err.message}`)
        // await api.moods.post()
      }
    }
  })
  renderMoodData(null, {})
}

addLogin()
main()

render(pages.index(), document.body)
