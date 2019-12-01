
import { render, html } from 'lit-html'
import { model } from '../shared/utils.js'
import constants from '../shared/constants'
import cache from '../services/cache.js'
import { api } from '../services/api.js'

import moodGraphs from '../view/mood-graphs.js'

const components = {}

const onOpacityClick = state => toggleNavMenu(state)

components.page = (main, state) => {
  return html`
    <div @click=${onOpacityClick(state)} id="screen-opacity" style="visibility: hidden;"></div>
    <div class="grid-container">
      ${components.header(state)}
      ${components.menu(state)}
      <main>
      ${main}
      </main>
    </div>
  `
}

const toggleTheme = state => () => {
  const $html = document.querySelector('html')
  const theme = $html.getAttribute('data-theme') || 'light'
  const newTheme = theme === 'light'
    ? 'dark'
    : 'light'

  $html.setAttribute('data-theme', newTheme)

  moodGraphs.refreshMoodGraphs()

  if (newTheme === 'dark') {
    document.querySelector('#dark-mode-toggle').textContent = '☀️'
    document.querySelector('#menu-dark-mode-toggle').textContent = '☀️ Light Mode'
  } else {
    document.querySelector('#dark-mode-toggle').textContent = '🌙'
    document.querySelector('#menu-dark-mode-toggle').textContent = '🌙 Dark Mode'
  }
}

const toggleVisibility = $elem => {
  if ($elem.style.visibility === 'hidden') {
    $elem.style.visibility = ''
  } else {
    $elem.style.visibility = 'hidden'
  }
}

const toggleNavMenu = state => () => {
  const $opacity = document.getElementById('screen-opacity')
  const $menu = document.getElementById('menu')

  toggleVisibility($opacity)
  toggleVisibility($menu)
}

components.header = state => {
  return html`
    <header>
      <nav id="mood-header">
        <div id="nav-menu" @click=${toggleNavMenu(state)}>☰</div>
        <a href="/"><h1 id="brand">mood.</h1></a>
        <div id="dark-mode-toggle" class="dark-mode-toggle" @click=${toggleTheme(state)}>🌙</div>
        </nav>
    </header>`
}

const onPrivacyClick = state => () => {
  render(pages.privacy(state), document.body)
}

const onRegisterClick = state => () => {
  render(pages.register(state), document.body)
}

const onHomeClick = state => () => {
  render(pages.index(state), document.body)
  moodGraphs.refreshMoodGraphs()
}

components.menu = state => {
  return html`
    <nav id="menu" style="visibility: hidden;">
      <ul>
        <li id="menu-home" @click=${onHomeClick(state)}>🏠 Home</li>
        <li id="menu-register" @click=${onRegisterClick(state)}>👤 Register</li>
        <li id="menu-privacy" @click=${onPrivacyClick(state)}>🔒 Privacy</li>
        <li><div class='nav-divider'></div></li>
        <li id="menu-dark-mode-toggle" @click=${toggleTheme(state)}>🌙 Dark Mode </li>
      </ul>
    </nav>
  `
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

    moodGraphs.refreshMoodGraphs()
  } else if (res.status === 401) {
    state.authenticated = false
    state.passwordIncorrect = true

    render(pages.signin(state), document.body)
    moodGraphs.refreshMoodGraphs()
  }
}

const onRegisterSubmitClick = state => async event => {
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

components.signinPanel = state => {
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

          <input id="mood-signin-submit" @click=${onSigninSubmitClick(state)} class="${state}" type="submit" value="${submitText}">

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

          <input id="mood-signup-submit" @click=${onRegisterSubmitClick(state)} class="${state}" type="submit" value="${submitText}">

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
    <section id="mood-policy" class="mood-panel">
    ${components.sectionHeader('Privacy Policy')}

    <h3>Password Storage</h3>

    <p>Passwords are stored as bcrypt salted-hashes in Firebase, are not logged, and are never stored in plain-text.</p>

    <h3>User Information Storage</h3>

    <p>User-information is stored in Firebase. As of 1 December 2019, we store:</p>

    <ul>
      <li>an array of hashed forwardedFor headers</li>
      <li>an array of hashed ip headers</li>
      <li>the user's password (as described above)</li>
      <li>the username and userid</li>
      <li>the total number of requests made by the user</li>
      <li>any submitted moods and their corresponding timestamps</li>
    </ul>

    <p>This information is presently not encrypted when stored.</p>

    <h3>Information Usage</h3>

    <p>The information listed above is stored in Firebase, but won't be shared with any other third-parties. The following fields may be used for security purposes:</p>

    <ul>
      <li>an array of hashed forwardedFor headers</li>
      <li>an array of hashed ip headers</li>
      <li>the total number of requests made by the user</li>
    </ul>

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

  const signinMain = html`
    ${components.signinPanel(state)}
  `

  return components.page(signinMain, state)
}

pages.register = state => {
  if (!state) {
    throw new Error('state not supplied to page')
  }

  const registerMain = html`
    ${components.registerPanel(state)}
  `

  return components.page(registerMain, state)
}

export default pages
