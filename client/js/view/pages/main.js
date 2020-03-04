
import { html, render } from 'lit-html'

import components from '../components'
import { model } from '../../shared/utils'
import constants from '../../shared/constants.js'

import cache from '../../services/cache.js'
import { api } from '../../shared/api.js'

import moodGraphs from '../mood-graphs.js'

/**
 * Construct a panel containing the mood inputs.
 *
 * @param {Object} state the application state
 */
components.moodPanel = (pages, state) => {
  const data = constants.moods.map(data => {
    return {
      title: data.name
    }
  })

  return html`
    <section id="mood-box" class="mood-panel">
    ${components.h2('How are you?')}
    <div class="emoji-container">
      ${data.map(components.mood.bind(null, pages, state))}
    </div>
    </section>
  `
}

/**
 * Create a mood component
 *
 * @param {Object} state the application state
 */
components.mood = (pages, state, { title, emoji }, idx) => {
  const filename = title.toLowerCase().replace(' ', '-')

  return html`<div id="mood-${idx}" class="mood-emotion" @click=${components.mood.onClick.bind(null, pages, state)} title="${title}">
    <img src="../svg/${filename}.svg" title="${title}"></img>
  </div>`
}

const redrawPage = (pages, state) => {
  render(pages.main(pages, state), document.body)
  moodGraphs.refreshMoodGraphs(state)
}

components.mood.onClick = async (pages, state, event) => {
  const data = model.event(event.target)
  cache.addEvent(data)

  try {
    await api.moods.post()

    state.toast = {
      text: 'Mood Saved'
    }

  } catch (err) {
    state.toast = {
      text: 'Failed to Save Mood'
    }

    console.error(`failed to send events: ${err.message}`)
  }

  redrawPage(pages, state)

  setTimeout(() => {
    state.toast = null
    redrawPage(pages, state)
  }, 15000)
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
    ${components.moodPanel(pages, state)}
    ${components.moodOverTime()}
    ${components.toast(state)}
  `

  return components.page(indexMain, pages, state)
}

export default mainPage
