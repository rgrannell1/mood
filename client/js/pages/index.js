
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

const state = {}

const setTheme = {}

setTheme.html = theme => {
  const [$html] = document.getElementsByTagName('html')

  const themeAttr = document.createAttribute('data-theme')
  themeAttr.value = theme

  $html.setAttributeNode(themeAttr)
}

const attach = {}

attach.formListener = () => {
  const $formSubmit = document.querySelector('#mood-signin-submit')

  $formSubmit.onclick = async event => {
    event.stopPropagation()

    const $user = document.querySelector('#mood-username')
    const $password = document.querySelector('#mood-password')

    const body = {
      user: $user.value,
      password: $password.value
    }

    const res = await fetch(`${constants.apiHost}/api/login`, {
      method: 'post',
      body: JSON.stringify(body)
    })

    if (res.status === 200) {
      state.authenticated = true
      render(pages.index(state), document.body)
    } else if (res.status === 401) {
      state.authenticated = false
      state.passwordIncorrect = true
      render(pages.signin(state), document.body)
    }
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

  attach.formListener()
}

initPage()

if (isAuthenticated()) {
  render(pages.index(state), document.body)
  refreshMoodGraphs()
} else {
  render(pages.signin(state), document.body)
}
