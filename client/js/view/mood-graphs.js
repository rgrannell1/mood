
import vegaEmbed from 'vega-embed'
import { api } from '../services/api.js'

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
  if (!data.hasOwnProperty('moods')) {
    throw new Error('data did not have moods property')
  }

  const [$html] = document.getElementsByTagName('html')
  const theme = $html.getAttribute('data-theme') || 'light'

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

moodGraphs.refreshMoodGraphs = async () => {
  try {
    const moods = await api.moods.get()
    const moodData = await moods.json()
    await moodGraphs.heatplot(moodData)
  } catch (err) {
    console.error('failed to render graph.')
    throw err
  }
}

export default moodGraphs
