
import { render } from 'lit-html'

import pages from '../view/pages.js'
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

const main = async () => {
  const isLoggedIn = await isAuthenticated()

  if (isLoggedIn) {
    render(pages.index(state), document.body)
    moodGraphs.refreshMoodGraphs()
  } else {
    render(pages.signin(state), document.body)
  }
}

main()
