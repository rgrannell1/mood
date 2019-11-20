
import { render } from 'lit-html'

import moodGraphs from '../view/mood-graphs.js'
import { api } from '../services/api.js'

import pages from '../view/pages.js'
import constants from '../shared/constants'

import {
  registerServiceWorker
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

const state = {
  signin: {

  },
  register: {

  }
}

const setTheme = {}

setTheme.html = theme => {
  const [$html] = document.getElementsByTagName('html')

  const themeAttr = document.createAttribute('data-theme')
  themeAttr.value = theme

  $html.setAttributeNode(themeAttr)
}

const isAuthenticated = () => {
  return state.authenticated === true
}

/**
 * Run the client-side code
 */
async function initPage () {
  await registerServiceWorker()
}

initPage()

setInterval(async () => {
  await refreshMoodGraphs()
}, 1000)

if (isAuthenticated()) {
  render(pages.index(state), document.body)
  refreshMoodGraphs()
} else {
  render(pages.signin(state), document.body)
}
