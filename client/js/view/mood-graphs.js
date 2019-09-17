
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
  const schema = {
    $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
    description: 'Mood over time.',
    mark: 'point',
    width: 500,
    height: 500,
    encoding: {
      x: {
        field: 'timestamp',
        type: 'temporal',
        axis: {
          grid: false,
          title: 'date'
        }
      },
      y: {
        field: 'mood',
        type: 'ordinal',
        sort: moods
      },
      color: {
        field: 'mood',
        type: 'ordinal',
        sort: moods,
        scale: {
          range: moods.map(pointColour)
        }
      }
    },
    data: {
      values: data.moods
    }
  }

  await vegaEmbed('#mood-over-time', schema)

  /*
  const view = new vega.View(vega.parse(schema), {
    renderer: 'canvas',
    container: '#mood-over-time',
    hover: false
  })

  view.run()
   */
}

export default moodGraphs
