
import vegaEmbed from 'vega-embed'
import { api } from '../shared/api'
import constants from '../shared/constants'

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

/**
 * get the heatplot configuration for a theme
 *
 * @param {string} theme the theme to use
 *
 * @returns {object} Vega configuration
 */
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
    Object.assign(config, { })
  }

  return config
}

/**
 * Plot a heatplot of moods over time
 *
 * @param {Object} data the user's mood data
 */
moodGraphs.heatplot = async data => {
  if (!data.hasOwnProperty('moods')) {
    throw new Error('data did not have moods property')
  }

  const [$html] = document.getElementsByTagName('html')
  const theme = $html.getAttribute('data-theme') || 'light'

  const spec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v4.0.0-beta.9.json',
    autosize: { type: 'fit', resize: true },
    data: {
      values: data.moods
    },
    mark: 'rect',
    config: getHeatplotConfig(theme),
    encoding: {
      y: {
        field: 'mood',
        type: 'nominal',
        sort: constants.moodOrdering
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
    //height: 200,
    "autosize": {
      "type": "fit",
      "contains": "padding"
    },

  })
}

/**
 * Draw a mood heatplot to the page
 */
moodGraphs.refreshMoodGraphs = async state => {
  try {
    const moods = await api.moods.get()
    const moodData = await moods.json()

    state.moods = moods

    await moodGraphs.heatplot(moodData)
  } catch (err) {
    console.error('failed to render graph.')
    throw err
  }
}

export default moodGraphs
