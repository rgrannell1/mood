
import { render } from 'lit-html'

import moodGraphs from '../view/mood-graphs.js'

import pages from '../view/pages.js'

import {
  registerServiceWorker
} from '../shared/utils.js'

const state = {
  signin: {

  },
  register: {

  }
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

if (isAuthenticated()) {
  render(pages.index(state), document.body)
} else {
  render(pages.signin(state), document.body)
}
