
const asScale = mood => {
  const moods = [
    'Atrocious',
    'In pain',
    'Ennui',
    'Bad',
    'Neutral',
    'Decent',
    'Fine',
    'Stellar'
  ]
  return moods.indexOf(mood)
}

const moodGraphs = {}

/**
 * Draw a scatterplot to the canvas
 *
 * @param {Object}
 */
moodGraphs.scatterplot = data => {
  const $canvas = document.querySelector('#mood-over-time')
  const { width, height } = $canvas

  const offset = data.stats.to - data.stats.from

  const coordinates = data.moods.map(datum => {
    return {
      x: (datum.timestamp - data.stats.from) / offset,
      y: asScale(datum.mood) / 7
    }
  })

  // -- todo refactor this into css variables or
  const margins = {
    x: 50,
    y: 50
  }

  const useable = {
    width: width - (2 * margins.x),
    height: height - (2 * margins.y)
  }

  const scaled = coordinates.map(coords => {
    return {
      x: (coords.x * useable.width) + margins.x,
      y: (coords.y * useable.height) + margins.y,
    }
  })

  const ctx = $canvas.getContext('2d')

  for (const coord of scaled) {
    ctx.strokeRect(coord.x, coord.y, 1, 1)
  }
}

export default moodGraphs