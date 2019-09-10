
const asScale = (canvas, mood) => {
  const {width, height} = canvas

  const moods = [
    'Stellar',
    'Fine',
    'Decent',
    'Neutral',
    'Bad',
    'Ennui',
    'In pain',
    'Atrocious'
  ]
  return moods.indexOf(mood)
}

const drawAxes = (data, $canvas) => {
  const media = {
    mobile: window.matchMedia('(max-width: 415px)').matches,
    desktop: window.matchMedia('(max-width: 961px)').matches,
    tablet: window.matchMedia('(min-width: 416px)').matches &&
      window.matchMedia('(max-width: 960px)').matches
  }

  const config = {
    tickCount: 0
  }

  if (media.mobile) {
    config.tickCount = 4
  } else if (media.desktop) {
    config.tickCount = 8
  } else if (media.tablet) {
    config.tickCount = 6
  } else {
    config.tickCount = 6
  }

  const { width, height } = $canvas

  const ticks = {
    x: []
  }

  const offset = data.stats.to - data.stats.from
  const margins = {
    x: 25,
    y: 25
  }

  const useable = {
    width: width - (2 * margins.x),
    height: height - (2 * margins.y)
  }

  let time = data.stats.from
  for (let ith = 1; ith <= config.tickCount; ++ith) {
    let pct = (ith / config.tickCount)
    time += offset * pct

    ticks.x.push({
      x: (useable.width * pct) + margins.x,
      time: new Date(time)
    })
  }

  const ctx = $canvas.getContext('2d')

  for (const tick of ticks.x) {
    const x = tick.x
    const y = height - margins.y

    ctx.font = "normal 0.5em 'Calibri'";
    ctx.fillText(tick.time, x, y)

  }
}


const pointColour = magnitude => {
  const cssVar = val => {
    return getComputedStyle(document.documentElement).getPropertyValue(`--${val}`)
  }

  const colours = [
    cssVar('graph-colour-stellar'),
    cssVar('graph-colour-stellar'),
    cssVar('graph-colour-fine'),
    cssVar('graph-colour-decent'),
    cssVar('graph-colour-neutral'),
    cssVar('graph-colour-bad'),
    cssVar('graph-colour-ennui'),
    cssVar('graph-colour-in-pain'),
    cssVar('graph-colour-atrocious')
  ]

  return colours[magnitude]
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
    const x = (coords.x * useable.width) + margins.x
    const y = (coords.y * useable.height) + margins.y
    return {
      x,
      y,
      colour: pointColour(y)
    }
  })

  const ctx = $canvas.getContext('2d')

  ctx.clearRect(0, 0, width, height);

  for (const coord of scaled) {
    ctx.strokeRect(coord.x, coord.y, 1, 1)
  }

  drawAxes(data, $canvas)
}

export default moodGraphs
