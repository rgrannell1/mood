
import { html } from 'lit-html'

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
        <div id="google-signin" class="g-signin2"></div>
        </nav>
    </header>`
}

components.sectionHeader = title => {
  return html`<h2 class="mood-h2">${title}</h2>`
}

components.moodGraph = () => {
  return html`
    <section id="mood-graph" class="mood-panel">
      ${components.sectionHeader('Mood over time')}
      <canvas id="mood-over-time"></canvas>
    </section>`
}

components.mood = ({ title, emoji }, idx) => {
  return html`<div id="mood-${idx}" class="mood-emotion" title="${title}">${emoji}</div>`
}

components.moodPanel = () => {
  const data = [
    { title: 'Atrocious', emoji: '💀' },
    { title: 'In pain', emoji: '😩' },
    { title: 'Ennui', emoji: '😔' },
    { title: 'Bad', emoji: '😑' },
    { title: 'Neutral', emoji: '😐' },
    { title: 'Decent', emoji: '🙂' },
    { title: 'Fine', emoji: '😊' },
    { title: 'Stellar', emoji: '😇' }
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
      <p>TLDR: this site will not use your data in a malicious manner</p>

      <p>The site may track:</p>
      <ul>
        <li>a hash of the users ip-address</li>
        <li>the user-agent</li>
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

export default pages
