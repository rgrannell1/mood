
import { html } from 'lit-html'

import api from '../../shared/api'
import components from '../components'

/**
 * Construct the edit panel.
 *
 * @param {Object} state the application state
 */
components.edit = state => {
  let moodComponents = []

  state.page = 'edit'

  if (state.moods) {
    moodComponents = state.moods.map(mood => {
      return `<div>${mood.mood}</div>`
    })
  }

  return html`<section id="mood-edit" class="mood-panel">
    ${components.h2('Edit Moods')}
    ${moodComponents}
    `
}

/**
 * Create the edit-page component
 *
 * @returns {HTML} index-page
 */
const editPage = (pages, state) => {
  if (!state.edit) {
    state.edit = {}
  }

  state.currentPage = editPage

  return components.page(components.edit(state), pages, state)
}

export default editPage
