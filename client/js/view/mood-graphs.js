
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

  vegaEmbed('#mood-over-time', spec, {
    renderer: 'svg'
  })
}

export default moodGraphs
