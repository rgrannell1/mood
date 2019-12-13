
import { html, render } from 'lit-html'
import constants from '../../shared/constants.js'
import moodGraphs from '../mood-graphs.js'

import components from '../components'

/**
 * The signin component.
 *
 * @param {Object} pages
 * @param {Object} state the application state
 */
components.signinPanel = (pages, state) => {
  const submitText = 'Sign In'

  return html`
    <section id="mood-signin" class="mood-panel">
      ${components.h2('Sign In')}
        <div id="mood-input-form">
          <label for="mood-username">Username:</label>
          <input class="form-input" id="mood-username" @keydown=${components.signinPanel.onUpdate(pages, state)} type="text" spellcheck="false" aria-label="Username"></input>

          <label for="mood-password">Password (min 14 characters):</label>
          <input class="form-input" id="mood-password" @keydown=${components.signinPanel.onUpdate(pages, state)} type="password" spellcheck="false" minlength="14" aria-label="Enter your password"></input>

          <div id="mood-signin-error">${state.signin.error}</div>

          <input id="mood-signin-submit" @click=${components.signinPanel.onSubmitClick(pages, state)} class="${state}" type="submit" value="${submitText}">

          <p id="mood-create-account" @click=${components.signinPanel.onCreateAccountLinkClick(pages, state)}>Create Account</p>
          </div>
    </section>
  `
}

/**
 * The signin component's "create account" link click-handler.
 *
 * @param {Object} pages
 * @param {Object} state the application state
 */
components.signinPanel.onCreateAccountLinkClick = (pages, state) => async event => {
  state.signin = null

  render(pages.register(pages, state), document.body)
}

/**
 * The signin component's "keydown" keypress-handler.
 *
 * @param {Object} pages
 * @param {Object} state the application state
 */
components.signinPanel.onUpdate = (pages, state) => async event => {
  const $user = document.querySelector('#mood-username')
  const $password = document.querySelector('#mood-password')

  let error = ' '

  const usernameTooShort = !$user.value || $user.value.length < 5
  const passwordTooShort = !$password.value || $password.value.length < 14

  if (usernameTooShort && passwordTooShort) {
    error = 'username & password too short'
  } else if (usernameTooShort) {
    error = 'username too short'
  } else if (passwordTooShort) {
    error = 'password too short'
  }

  state.signin.error = error

  render(pages.signin(pages, state), document.body)
}

/**
 * The signin component's submit button click-handler.
 *
 * @param {Object} pages
 * @param {Object} state the application state
 */
components.signinPanel.onSubmitClick = (pages, state) => async event => {
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
    state.signin = null

    render(pages.main(pages, state), document.body)
    moodGraphs.refreshMoodGraphs()
  } else if (res.status === 401) {
    render(pages.signin(state), document.body)
    moodGraphs.refreshMoodGraphs()
  }
}

/**
 * The signin page
 *
 * @param {Object} pages
 * @param {Object} state the application state
 */
const signinPage = (pages, state) => {
  if (!state.signin) {
    state.signin = {
      error: ' '
    }
  }

  return components.page(components.signinPanel(pages, state), pages, state)
}

export default signinPage
