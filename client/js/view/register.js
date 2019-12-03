
import { render, html } from 'lit-html'
import sharedComponents from './components'

const handlers = {}

handlers.submit = state => async event => {
  event.stopPropagation()

  const $user = document.querySelector('#mood-username')
  const $password = document.querySelector('#mood-password')
  const $passwordRepeat = document.querySelector('#mood-password-repeat')

  const passwordsEqual = $password.value === $passwordRepeat.value

  if (passwordsEqual) {
    state.register.passwordMismatch = false
    render(pages.register(state), document.body)
  } else {
    state.register.passwordMismatch = true
    render(pages.register(state), document.body)
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
    render(pages.index(state), document.body)
  } else if (res.status === 401) {
    state.authenticated = false
    state.passwordIncorrect = true
    render(pages.register(state), document.body)
  }
}

const components = {}

components.registerPanel = state => {
  let submitText = 'Sign Up'

  if (state.register.passwordMismatch) {
    submitText = 'Passwords Do Not Match'
  }

  return html`
    <section id="mood-signup" class="mood-panel">
      ${components.sectionHeader('Sign Up')}
        <div id="mood-input-form">
          <label for="mood-username">Username:</label>
          <input id="mood-username" type="text" spellcheck="false" aria-label="Username"></input>

          <label for="mood-password">Password (min 14 characters):</label>
          <input id="mood-password" type="password" spellcheck="false" minlength="14" aria-label="Enter your password"></input>

          <label for="mood-password-repeat">Re-enter Password:</label>
          <input id="mood-password-repeat" type="password" spellcheck="false" minlength="14" aria-label="Re-enter your password"></input>

          <input id="mood-signup-submit" @click=${handlers.submit(state)} class="${state}" type="submit" value="${submitText}">

          <p id="mood-create-account" @click=${onSigninAccountLinkClick(state)}>Already Registered? Sign In</p>
          </div>
    </section>`
}

/**
 * Render the register page
 *
 * @param {Object} state page-state
 */
const register = state => {
  const registerMain = html`${components.registerPanel(state)}`

  return components.page(registerMain, state)
}

export default register
