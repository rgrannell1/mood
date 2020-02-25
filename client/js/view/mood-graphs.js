
import { api } from '../shared/api'
import constants from '../shared/constants'
import * as vega from 'vega'

import moodOverTime from './graphs/mood-over-time'

const moodGraphs = {}

/**
 *
 * get the value of a css property.
 *
 * @param {string} variable the css variable name
 *
 * @returns {any} the css property value
 */
const getCssVariable = variable => {
  return window.getComputedStyle(document.body).getPropertyValue(`--${variable}`)
}

moodGraphs.line = moodOverTime
/**
 * Draw a mood heatplot to the page
 */
moodGraphs.refreshMoodGraphs = async state => {
  try {
    const moods = await api.moods.get()
    const moodData = await moods.json()

    state.moods = moods

    await moodGraphs.line(moodData)
  } catch (err) {
    console.error('failed to render graph.')
    throw err
  }
}

export default moodGraphs
