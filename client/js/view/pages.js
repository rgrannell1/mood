
import { html } from 'lit-html'
import constants from '../shared/constants'

const components = {}

components.page = main => {
  return html`
    <div class="grid-container">
      ${components.header()}
      <main>
      ${main}
      </main>
    </div>
  `
}

components.header = () => {
  return html`
    <header>
      <nav id="mood-header">
        <a href="/"><h1 id="brand">mood.</h1></a>
        <div id="dark-mode-toggle" class="dark-mode-toggle">🌙</div>
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

components.signinPanel = () => {
  return html`
    <section id="mood-signin" class="mood-panel">
      ${components.sectionHeader('Sign In')}
        <label for="mood-username">Username:</label>
        <input id="mood-username" type="text" spellcheck="false" aria-label="Username"></input>

        <label for="mood-password">Password (min 14 characters):</label>
        <input id="mood-password" type="password" spellcheck="false" minlength="14" aria-label="Enter your password"></input>

        <input id="mood-signin-submit" type="submit" value="Sign In">

    </section>
  `
}

components.mood = ({ title, emoji }, idx) => {
  const filename = title.toLowerCase().replace(' ', '-')

  return html`<div id="mood-${idx}" class="mood-emotion" title="${title}">
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
pages.index = () => {
  const indexMain = html`
    ${components.moodPanel()}
    ${components.moodGraph()}
  `
  return components.page(indexMain)
}

/**
 * Create the privacy-page component
 *
 * @returns {HTML} index-page
 */
pages.privacy = () => {
  const privacyMain = html`
    ${components.privacyPolicy()}
  `
  return components.page(privacyMain)
}

pages.signin = () => {
  const signinMain = html`
    ${components.signinPanel()}
  `

  return components.page(signinMain)
}

export default pages
