
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
  let submitText = 'Sign In'

  if (state === 'submit-invalid-password') {
    submitText = 'Incorrect Password'
  }

  return html`
    <section id="mood-signin" class="mood-panel">
      ${components.h2('Sign In')}
        <div id="mood-input-form">
          <label for="mood-username">Username:</label>
          <input class="form-input" id="mood-username" type="text" spellcheck="false" aria-label="Username"></input>

          <label for="mood-password">Password (min 14 characters):</label>
          <input class="form-input" id="mood-password" type="password" spellcheck="false" minlength="14" aria-label="Enter your password"></input>

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
  render(pages.register(pages, state), document.body)
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
    state.authenticated = true
    render(pages.main(pages, state), document.body)

    moodGraphs.refreshMoodGraphs()
  } else if (res.status === 401) {
    state.authenticated = false
    state.passwordIncorrect = true

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
    state.signin = {}
  }

  return components.page(components.signinPanel(state), pages, state)
}

export default signinPage
