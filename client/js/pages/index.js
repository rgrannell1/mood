
import { render } from 'lit-html'

import pages from '../view/pages/index.js'
import moodGraphs from '../view/mood-graphs.js'
import { api } from '../services/api'

import {
  registerServiceWorker
} from '../shared/utils.js'

const state = {
  signin: { },
  register: { }
}

const isAuthenticated = async () => {
  const result = await api.moods.get()
  return result.status === 200
}

/**
 * Run the client-side code
 */
async function initPage () {
  await registerServiceWorker()
}

initPage()

/**
 * Render the mood SPA
 */
const renderPage = async () => {
//  const isLoggedIn = await isAuthenticated()

  if (true) {
  //if (isLoggedIn) {
    render(pages.main(pages, state), document.body)
    moodGraphs.refreshMoodGraphs()
  } else {
    render(pages.signin(pages, state), document.body)
  }
}

renderPage()
