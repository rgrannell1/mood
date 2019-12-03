
import { html, render } from 'lit-html'
import constants from '../../shared/constants.js'

import components from '../components'

/**
 * The registration panel component.
 *
 * @param {Object} state the application state
 */
components.registerPanel = (pages, state) => {
  let submitText = 'Sign Up'

  if (state.register.passwordMismatch) {
    submitText = 'Passwords Do Not Match'
  }

  return html`
    <section id="mood-signup" class="mood-panel">
      ${components.h2('Sign Up')}
        <div id="mood-input-form">
          <label for="mood-username">Username:</label>
          <input class="form-input" id="mood-username" type="text" spellcheck="false" aria-label="Username"></input>

          <label for="mood-password">Password (min 14 characters):</label>
          <input class="form-input" id="mood-password" type="password" spellcheck="false" minlength="14" aria-label="Enter your password"></input>

          <label for="mood-password-repeat">Re-enter Password:</label>
          <input class="form-input" id="mood-password-repeat" type="password" spellcheck="false" minlength="14" aria-label="Re-enter your password"></input>

          <input id="mood-signup-submit" @click=${components.registerPanel.onRegisterSubmitClick(pages, state)} class="${state}" type="submit" value="${submitText}">

          <p id="mood-create-account" @click=${components.registerPanel.onSigninLinkClick(pages, state)}>Already Registered? Sign In</p>
          </div>
    </section>`
}

/**
 * Render the signin page when clicking the signin register link
 *
 * @param {Object} state the application state
 */
components.registerPanel.onSigninLinkClick = (pages, state) => async event => {
  render(pages.signin(page, state), document.body)
}

/**
 * Render the signin page when clicking the signin register link
 *
 * @param {Object} state the application state
 */
components.registerPanel.onRegisterSubmitClick = (pages, state) => async event => {
  event.stopPropagation()

  const $user = document.querySelector('#mood-username')
  const $password = document.querySelector('#mood-password')
  const $passwordRepeat = document.querySelector('#mood-password-repeat')

  const passwordsEqual = $password.value === $passwordRepeat.value

  if (passwordsEqual) {
    state.register.passwordMismatch = false
    render(pages.register(pages, state), document.body)
  } else {
    state.register.passwordMismatch = true
    render(pages.register(pages, state), document.body)
  }

  const body = {
    user: $user.value,
    password: $password.value
  }

  const res = await fetch(`${constants.apiHost}/api/register`, {
    method: 'post',
    body: JSON.stringify(body)
  })

  if (res.status === 200) {
    state.authenticated = true
    render(pages.main(pages, state), document.body)
  } else if (res.status === 401) {
    state.authenticated = false
    state.passwordIncorrect = true
    render(pages.register(pages, state), document.body)
  }
}

const registerPage = (pages, state) => {
  return components.page(components.registerPanel(pages, state), pages, state)
}

export default registerPage
