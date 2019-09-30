
/**
 *
 * @param {string} mood
 */
const pointColour = mood => {
  const cssVar = val => {
    return window.getComputedStyle(document.documentElement).getPropertyValue(`--${val}`)
  }

  const label = mood.toLowerCase().replace(' ', '-')
  return cssVar(`graph-colour-${label}`)
}

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

const moodGraphs = {}

/**
 * Draw a scatterplot to the canvas
 *
 * @param {Object}
 */
moodGraphs.scatterplot = async data => {

}

moodGraphs.heatplot = async data => {
  const spec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
    data: {
      values: data.moods
    },
    mark: 'rect',
    encoding: {
      y: {
        field: 'mood',
        type: 'nominal',
        sort: [
          'Stellar',
          'Fine',
          'Decent',
          'Neutral',
          'Bad',
          'Ennui',
          'In pain',
          'Atrocious'
        ]
      },
      x: {
        timeUnit: 'day',
        field: 'timestamp',
        type: 'temporal'
      },
      color: {
        aggregate: 'count',
        field: 'mood',
        type: 'quantitative'
      }
    }
  }

  vegaEmbed('#mood-over-time', spec)
}

export default moodGraphs
