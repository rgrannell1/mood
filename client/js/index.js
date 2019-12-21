
import { render } from 'lit-html'

import pages from './view/pages/index.js'
import moodGraphs from './view/mood-graphs.js'

import {
  registerServiceWorker
} from './shared/utils.js'

const state = {
  menu: { },
  signin: { },
  register: { }
}

const isAuthenticated = () => {
  return document.cookie.includes('mood-session.sig')
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
const landingPage = async () => {
  state.isLoggedIn = isAuthenticated()

  if (state.isLoggedIn) {
    render(pages.main(pages, state), document.body)
    moodGraphs.refreshMoodGraphs(state)
  } else {
    render(pages.signin(pages, state), document.body)
  }
}

landingPage(state)
