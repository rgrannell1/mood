
import { render } from 'lit-html'

import moodGraphs from '../view/mood-graphs.js'
import { api } from '../services/api.js'
import cache from '../services/cache.js'

import pages from '../view/pages.js'
import constants from '../shared/constants'

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

const attach = {}

attach.emotionPost = () => {
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
}

attach.darkModeToggle = () => {
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
}

attach.formListener = () => {
  const $formSubmit = document.querySelector('#mood-signin-submit')

  $formSubmit.onclick = async event => {
    const $user = document.querySelector('#mood-username')
    const $password = document.querySelector('#mood-password')

    const body = {
      user: $user.value,
      password: $password.value
    }

    await fetch(`${constants.apiHost}/api/login`, {
      method: 'post',
      body: JSON.stringify(body)
    })
  }
}

/**
 * Run the client-side code
 */
async function initPage () {
  await registerServiceWorker()

  attach.emotionPost()
  attach.darkModeToggle()
  attach.formListener()

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
