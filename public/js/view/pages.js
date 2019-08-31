
import { html } from 'https://unpkg.com/lit-html@1.1.2/lit-html.js'

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
        <h1 id="brand">mood.</h1>
        <div id="google-signin" class="g-signin2" data-onsuccess="onSignIn"></div>
        </nav>
    </header>
  `
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

const pages = {}

pages.index = () => {
  const indexMain = html`
    ${components.moodPanel()}
    ${components.moodGraph()}
  `
  return components.page(indexMain)
}

export default pages
