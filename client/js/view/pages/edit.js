
import { html } from 'lit-html'
import { until } from 'lit-html/directives/until.js'

import { api } from '../../shared/api'
import { formatDate } from '../../shared/utils'
import components from '../components'

components.moodRow = mood => {
  const time = formatDate(new Date(mood.timestamp))
  const centre = html`
  <li>
    <div>
      <h2>${time}</h2>
      <span>${mood.mood}</span>
    </div>
  <li>
  `
  return html`<li>${centre}</li>`
}

/**
 * Construct the edit panel.
 *
 * @param {Object} state the application state
 */
components.edit = state => {
  state.page = 'edit'

  const moods = api.moods.get()
    .then(res => res.json())
    .then(data => data.moods.reverse().map(components.moodRow))

  const moodComponents = html`${until(moods, html`<span>Loading</span>`)}`

  return html`<section id="mood-edit" class="mood-panel">
    ${components.h2('Edit Moods')}
    <ul>
      ${moodComponents}
    </ul>
  `
}

/**
 * Create the edit-page c
 *
 * @returns {HTML} index-page
 */
const editPage = (pages, state) => {
  if (!state.edit) {
    state.edit = {}
  }

  state.currentPage = editPage

  return components.page(html`${components.edit(state)}`, pages, state)
}

export default editPage
