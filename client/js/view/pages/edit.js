
import { html, render } from 'lit-html'
import { until } from 'lit-html/directives/until.js'
import dayjs from 'dayjs'

const getTime = date => {
  return `${dayjs(date).format('HH:mm:ss')}`
}

import components from '../components'

import getMoodsByDate from '../../services/get-moods-by-date'

const services = {
  getMoodsByDate
}

components.moodGroup = (pages, state, date, dayMoods) => {
  const isBulkChecked = state.edit[date] && state.edit[date].bulk

  const moodRows = dayMoods.map((mood, ith) => {
    const checkbox = isBulkChecked
      ? html`<input class="mood-edit-select" type="checkbox" checked="checked"></input>`
      : html`<input class="mood-edit-select" type="checkbox"></input>`

    const time = getTime(mood.timestamp)

    return html`
    <div class="mood-edit-row">
      ${checkbox}
      <span class="mood-edit-mood" title="${time}">${mood.mood}</span>
    </div>
    `
  })

  const onSelectAll = () => components.moodGroup.groupSelect(pages, date, state)

  const checkbox = isBulkChecked
    ? html`<input class="mood-edit-bulk-select mood-edit-select" type="checkbox" checked="checked"  @change=${onSelectAll()}></input>`
    : html`<input class="mood-edit-bulk-select mood-edit-select" type="checkbox"  @change=${onSelectAll()}></input>`

  return html`
  <li class="mood-history-item">
    <h3 class="mood-edit-time">${date}</h3>
    <div class="mood-edit-group">
      <div class="mood-edit-row">
        ${checkbox}
        <div class="mood-edit-delete">
          <span class="mood-edit-delete-icon">x </span>
        </div>
      </div>
      ${moodRows}
    </div>
  `
}

components.moodGroup.groupSelect = (pages, date, state) => () => {
  if (!state.edit[date]) {
    state.edit[date] = {
      bulk: false
    }
  }

  if (state.edit[date].bulk) {
    state.edit[date].bulk = false
  } else {
    state.edit[date].bulk = true
  }

  render(editPage(pages, state, { fresh: false }), document.body)
}

/**
 * Construct the edit panel.
 *
 * @param {Object} state the application state
 */
components.edit = (pages, state, opts) => {
  state.page = 'edit'

  if (opts.fresh) {
    delete state.moods
  }

  if (!state.moods) {
    state.moods = services.getMoodsByDate()
  }

  const moodComponenets = state.moods
    .then(groups => {
      return Object
        .entries(groups)
        .map( ([date, dayMoods]) => components.moodGroup(pages, state, date, dayMoods))
    })

  const moodComponents = html`${until(moodComponenets, html`<span>Loading</span>`)}`

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
const editPage = (pages, state, opts = {fresh: true}) => {
  if (!state.edit) {
    state.edit = {}
  }

  state.currentPage = editPage

  return components.page(html`${components.edit(pages, state, opts)}`, pages, state)
}

export default editPage
