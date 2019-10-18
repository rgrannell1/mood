
const moodGraphs = {}

const getCssVariable = variable => {
  return window.getComputedStyle(document.body).getPropertyValue(`--${variable}`)
}

const getHeatplotConfig = theme => {
  const config = {}

  if (theme === 'dark') {
    Object.assign(config, {
      background: getCssVariable('graph-background'),
      title: {
        color: getCssVariable('graph-light')
      },
      style: {
        'guide-label': {
          fill: getCssVariable('graph-light')
        },
        'guide-title': {
          fill: getCssVariable('graph-light')
        }
      },
      axis: {
        domainColor: getCssVariable('graph-light'),
        gridColor: getCssVariable('graph-medium'),
        tickColor: getCssVariable('graph-light')
      }
    })
  } else {
    Object.assign(config, {

    })
  }

  return config
}

const moodOrdering = [
  'Stellar',
  'Fine',
  'Decent',
  'Neutral',
  'Bad',
  'Ennui',
  'In pain',
  'Atrocious'
]

moodGraphs.heatplot = async data => {
  const [$html] = document.getElementsByTagName('html')
  const theme = $html.getAttribute('data-theme')

  const spec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v4.0.0-beta.9.json',
    data: {
      values: data.moods
    },
    mark: 'rect',
    config: getHeatplotConfig(theme),
    width: 400,
    height: 200,
    encoding: {
      y: {
        field: 'mood',
        type: 'nominal',
        sort: moodOrdering
      },
      x: {
        timeUnit: 'monthdate',
        field: 'timestamp',
        type: 'temporal'
      },
      color: {
        aggregate: 'count',
        field: 'mood',
        scale: {
          range: [
            getCssVariable('graph-heatmap-from'),
            getCssVariable('graph-heatmap-to')
          ]
        },
        type: 'quantitative'
      }
    }
  }

  // eslint-disable-next-line no-undef
  vegaEmbed('#mood-over-time', spec, {
    renderer: 'svg',
    width: 400,
    height: 200
  })
}

export default moodGraphs
