
import dayjs from 'dayjs'
import { html } from 'lit-html'
import { until } from 'lit-html/directives/until.js'

import { api } from '../../shared/api'
import components from '../components'

components.moodGroup = (date, dayMoods) => {
  const moodRows = dayMoods.map(mood => {
    return html`
    <div class="mood-edit-row">
      <span class="mood-edit-mood">${mood.mood}</span>
      <span class="mood-edit-delete">x</span>
    </div>
    `
  })

  return html`
  <li class="mood-history-item">
    <h3 class="mood-edit-time">${date}</h3>
    <div class="mood-edit-group">
      ${moodRows}
    </div>
  `
}

const getDateString = date => {
  const isSameYear = dayjs(date).format('YYYY') === `${dayjs().year()}`

  if (isSameYear) {
    return `${dayjs(date).format('ddd MMM D')}`
  } else {
    return `${dayjs(date).format('MMM D YYYY')}`
  }
}

const groupedByDate = moods => {
  const grouped = {}

  for (const datum of moods) {
    const date = dayjs(new Date(datum.timestamp))
    const current = getDateString(date)

    if (!grouped[current]) {
      grouped[current] = [datum]
    } else {
      grouped[current].push(datum)
    }
  }

  return grouped
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
    .then(data => groupedByDate(data.moods.reverse()))
    .then(groups => {
      return Object
        .entries(groups)
        .map( ([date, dayMoods]) => components.moodGroup(date, dayMoods))
    })

  const moodComponents = html`${until(moods, html`<span>Loading</span>`)}`

  return html`<section id="mood-edit" class="mood-panel">
    ${components.h2('History')}
    <ul class="mood-history-list">
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
