
import { render } from 'lit-html'

import * as auth from './shared/auth.js'
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
 * Entrypoint to the application. This function renders to
 * mood SPA's entrypoint.
 *
 * @returns {undefined}
 */
const renderMoodLandingPage = async () => {
  await registerServiceWorker()

  state.isLoggedIn = auth.isAuthenticated()

  if (state.isLoggedIn) {
    console.log('user login detected.')

    render(pages.main(pages, state), document.body)
    moodGraphs.refreshMoodGraphs(state)
  } else {
    console.log('user login not detected.')

    render(pages.signin(pages, state), document.body)
  }
}

renderMoodLandingPage(state)
