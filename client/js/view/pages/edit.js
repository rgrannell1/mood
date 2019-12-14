
import { html } from 'lit-html'

import api from '../../shared/api'
import components from '../components'

/**
 * Construct the edit panel.
 *
 * @param {Object} state the application state
 */
components.edit = () => {
  return html`
    <section id="mood-edit" class="mood-panel">
    ${components.h2('Edit Moods')}
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

  return components.page(components.edit(), pages, state)
}

export default editPage
