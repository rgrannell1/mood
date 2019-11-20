
import { render, html } from 'lit-html'
import { model } from '../shared/utils.js'
import cache from '../services/cache.js'
import { api } from '../services/api.js'

const components = {}

components.page = (main, state) => {
  return html`
    <div class="grid-container">
      ${components.header(state)}
      <main>
      ${main}
      </main>
    </div>
  `
}

const toggleTheme = state => () => {
  const $toggle = document.querySelector('html')
  const theme = $toggle.getAttribute('data-theme') || 'light'
  const newTheme = theme === 'light'
    ? 'dark'
    : 'light'

  $toggle.setAttribute('data-theme', newTheme )
}

components.header = state => {
  return html`
    <header>
      <nav id="mood-header">
        <a href="/"><h1 id="brand">mood.</h1></a>
        <div id="dark-mode-toggle" class="dark-mode-toggle" @click=${toggleTheme(state)}>🌙</div>
        </nav>
    </header>`
}

components.sectionHeader = title => {
  return html`<h2 class="mood-h2">${title}</h2>`
}

components.moodGraph = () => {
  return html`
    <section id="mood-graph" class="mood-panel">
      ${components.sectionHeader('Timeline')}
      <div id="mood-over-time"></div>
    </section>`
}

const onCreateAccountLinkClick = state => async event => {
  render(pages.register(state), document.body)
}

const onSigninSubmitClick = state => async event => {

}

components.signinPanel = ({ state }) => {
  let submitText = 'Sign In'

  if (state === 'submit-invalid-password') {
    submitText = 'Incorrect Password'
  }

  return html`
    <section id="mood-signin" class="mood-panel">
      ${components.sectionHeader('Sign In')}
        <div id="mood-input-form">
          <label for="mood-username">Username:</label>
          <input id="mood-username" type="text" spellcheck="false" aria-label="Username"></input>

          <label for="mood-password">Password (min 14 characters):</label>
          <input id="mood-password" type="password" spellcheck="false" minlength="14" aria-label="Enter your password"></input>

          <input id="mood-signin-submit" @click=${onSigninSubmitClick} class="${state}" type="submit" value="${submitText}">

          <p id="mood-create-account" @click=${onCreateAccountLinkClick(state)}>Create Account</p>
          </div>
    </section>
  `
}

const onSigninAccountLinkClick = state => async event => {
  render(pages.signin(state), document.body)
}

components.registerPanel = state => {
  let submitText = 'Sign Up'

  if (state === 'submit-invalid-password') {
    submitText = 'Incorrect Password'
  }

  return html`
    <section id="mood-signup" class="mood-panel">
      ${components.sectionHeader('Sign Up')}
        <div id="mood-input-form">
          <label for="mood-username">Username:</label>
          <input id="mood-username" type="text" spellcheck="false" aria-label="Username"></input>

          <label for="mood-password">Password (min 14 characters):</label>
          <input id="mood-password" type="password" spellcheck="false" minlength="14" aria-label="Enter your password"></input>

          <label for="mood-password">Re-enter Password:</label>
          <input id="mood-password-repeat" type="password" spellcheck="false" minlength="14" aria-label="Re-enter your password"></input>

          <input id="mood-signup-submit" @click=${onSigninSubmitClick} class="${state}" type="submit" value="${submitText}">

          <p id="mood-create-account" @click=${onSigninAccountLinkClick(state)}>Already Registered? Sign In</p>
          </div>
    </section>`
}

const onMoodClick = async event => {
  const data = model.event(event.target)
  cache.addEvent(data)

  try {
    await api.moods.post()
  } catch (err) {
    console.error(`failed to send events: ${err.message}`)
  }
}

components.mood = ({ title, emoji }, idx) => {
  const filename = title.toLowerCase().replace(' ', '-')

  return html`<div id="mood-${idx}" class="mood-emotion" @click=${onMoodClick} title="${title}">
    <img src="svg/${filename}.svg" title="${title}"></img>
  </div>`
}

components.moodPanel = () => {
  const data = [
    { title: 'Atrocious' },
    { title: 'In pain' },
    { title: 'Ennui' },
    { title: 'Bad' },
    { title: 'Neutral' },
    { title: 'Decent' },
    { title: 'Fine' },
    { title: 'Stellar' }
  ]

  return html`
    <section id="mood-box" class="mood-panel">
    ${components.sectionHeader('How are you?')}
    <div class="emoji-container">
      ${data.map(components.mood)}
    </div>
    </section>
  `
}

components.privacyPolicy = () => {
  return html`
    <section id="mood-box" class="mood-panel">
    ${components.sectionHeader('Privacy Policy')}
    <div>

      <p>The site may track:</p>
      <ul>
        <li>a hash of the users ip-address</li>
        <li>the user-agent provided</li>
      </ul>

      <p>the user-agent is only used to spot poorly-crafted bots.</p>

      <p>NOTE: this site is not finished!</p>
    </div>
    </section>
  `
}

const pages = {}

/**
 * Create the index-page component
 *
 * @returns {HTML} index-page
 */
pages.index = state => {
  if (!state) {
    throw new Error('state not supplied to page')
  }
  const indexMain = html`
    ${components.moodPanel()}
    ${components.moodGraph()}
  `
  return components.page(indexMain, state)
}

/**
 * Create the privacy-page component
 *
 * @returns {HTML} index-page
 */
pages.privacy = state => {
  if (!state) {
    throw new Error('state not supplied to page')
  }

  const privacyMain = html`
    ${components.privacyPolicy()}
  `
  return components.page(privacyMain, state)
}

pages.signin = state => {
  if (!state) {
    throw new Error('state not supplied to page')
  }

  let signinState = 'submit-normal'

  if (state.passwordIncorrect) {
    signinState = 'submit-invalid-password'
  }

  const signinMain = html`
    ${components.signinPanel({
      state: signinState
    })}
  `

  return components.page(signinMain, state)
}

pages.register = state => {
  if (!state) {
    throw new Error('state not supplied to page')
  }

  const signinMain = html`
    ${components.registerPanel(state)}
  `

  return components.page(signinMain, state)
}

export default pages
