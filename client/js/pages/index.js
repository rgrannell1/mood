
import { render } from 'lit-html'

import moodGraphs from '../view/mood-graphs.js'
import { api } from '../services/api.js'
import cache from '../services/cache.js'

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

const setTheme = {}

setTheme.html = theme => {
  const [$html] = document.getElementsByTagName('html')

  const themeAttr = document.createAttribute('data-theme')
  themeAttr.value = theme

  $html.setAttributeNode(themeAttr)
}

setTheme.signin = theme => {
  const $signin = document.querySelector('#google-signin')

  const themeAttr = document.createAttribute('data-theme')
  themeAttr.value = theme

  $signin.setAttributeNode(themeAttr)
}

/**
 * Run the client-side code
 */
async function initPage () {
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

      const newTheme = currentTheme === 'light'
        ? 'dark'
        : 'light'

      setTheme.html(newTheme)
      setTheme.signin(newTheme)

      await refreshMoodGraphs()
    }
  })

  await refreshMoodGraphs()
}

initPage()

const isAuthenticated = () => {
  return false
}

if (isAuthenticated()) {
  render(pages.index(), document.body)
} else {
  render(pages.signin(), document.body)
}
