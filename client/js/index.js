
import { render } from 'lit-html'

import pages from './view/pages/index.js'
import moodGraphs from './view/mood-graphs.js'

import {
  registerServiceWorker
} from './shared/utils.js'

/**
 * The page state.
 */
const state = {
  menu: { },
  signin: { },
  register: { }
}

/**
 * Is there an existing session on this page?
 *
 * @returns {boolean}
 */
const isAuthenticated = () => {
  return document.cookie.includes('mood-session.sig')
}

/**
 * Entrypoint to the application. This function renders to
 * mood SPA's entrypoint.
 *
 * @returns {undefined}
 */
const renderMoodLandingPage = async () => {
  await registerServiceWorker()

  state.isLoggedIn = isAuthenticated()

  if (state.isLoggedIn) {
    render(pages.main(pages, state), document.body)
    moodGraphs.refreshMoodGraphs(state)
  } else {
    render(pages.signin(pages, state), document.body)
  }
}

renderMoodLandingPage(state)
