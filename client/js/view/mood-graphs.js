
import { api } from '../shared/api'

import moodOverTime from './graphs/mood-over-time'
import pixels from './graphs/pixels'

const moodGraphs = {}

moodGraphs.pixels = pixels

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
