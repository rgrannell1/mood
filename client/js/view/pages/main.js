
import { html } from 'lit-html'

import components from '../components'
import { model } from '../../shared/utils'

import cache from '../../services/cache.js'
import { api } from '../../shared/api.js'

/**
 * Construct a panel containing the mood inputs.
 *
 * @param {Object} state the application state
 */
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
    ${components.h2('How are you?')}
    <div class="emoji-container">
      ${data.map(components.mood)}
    </div>
    </section>
  `
}

/**
 * Create a mood component
 *
 * @param {Object} state the application state
 */
components.mood = ({ title, emoji }, idx) => {
  const filename = title.toLowerCase().replace(' ', '-')

  return html`<div id="mood-${idx}" class="mood-emotion" @click=${components.mood.onClick} title="${title}">
    <img src="../svg/${filename}.svg" title="${title}"></img>
  </div>`
}

components.mood.onClick = async event => {
  const data = model.event(event.target)
  cache.addEvent(data)

  try {
    await api.moods.post()
  } catch (err) {
    console.error(`failed to send events: ${err.message}`)
  }
}

/**
 * Create the index-page component
 *
 * @returns {HTML} index-page
 */
const mainPage = (pages, state) => {
  if (!state.main) {
    state.main = {}
  }

  state.currentPage = mainPage

  const indexMain = html`
    ${components.moodPanel()}
    ${components.moodGraph()}
  `
  return components.page(indexMain, pages, state)
}

export default mainPage
