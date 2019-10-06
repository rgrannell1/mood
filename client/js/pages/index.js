
import { render } from 'lit-html'

import moodGraphs from '../view/mood-graphs.js'
import { api } from '../services/api.js'
import cache from '../services/cache.js'
import { addLogin } from '../services/login.js'

import pages from '../view/pages.js'

import {
  registerServiceWorker,
  model
} from '../shared/utils.js'

const refreshMoodGraphs = async () => {
  try {
    const moodData = await api.moods.get()
    await moodGraphs.heatplot(await moodData.json())
  } catch (err) {
    console.error('failed to render graph.')
    throw err
  }
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
      cache.addEvent(data)

      try {
        await api.moods.post()
      } catch (err) {
        console.error(`failed to send events: ${err.message}`)
      }

      await refreshMoodGraphs()
    }
  })

  const $darkModeToggle = document.querySelectorAll('.dark-mode-toggle')

  $darkModeToggle.forEach(elem => {
    elem.onclick = async event => {
      const [$html] = document.getElementsByTagName('html')

      const currentTheme = $html.getAttribute('data-theme')
      const themeAttr = document.createAttribute('data-theme')

      themeAttr.value = currentTheme === 'light'
        ? 'dark'
        : 'light'

      $html.setAttributeNode(themeAttr)
      await refreshMoodGraphs()
    }
  })

  await refreshMoodGraphs()
}

addLogin()
main()

render(pages.index(), document.body)
