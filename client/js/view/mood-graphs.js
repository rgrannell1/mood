
import { api } from '../shared/api'
import constants from '../shared/constants'
import * as vega from 'vega'

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

moodGraphs.heatplot = async data => {
  if (!data.hasOwnProperty('moods')) {
    throw new Error('data did not have moods property')
  }

  const timeUnit = selectTimeBin(data)

  const [$html] = document.getElementsByTagName('html')
  const theme = $html.getAttribute('data-theme') || 'light'

  const spec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v4.0.0-beta.9.json',
    autosize: { type: 'fit', resize: true },
    data: {
      values: data.moods
    },
    signals: [
      {
        name: 'width',
        value: '',
        on: [{
          events: {
            source: 'window',
            type: 'resize'
          },
          update: 'containerSize()[0] * 0.95'
        }]
      },
      {
        name: 'height',
        value: '',
        on: [{
          events: {
            source: 'window',
            type: 'resize'
          },
          update: 'containerSize()[1] * 0.95'
        }]
      }
    ],
    mark: 'rect',
    config: getHeatplotConfig(theme),
    encoding: {
      y: {
        field: 'mood',
        type: 'nominal',
        sort: constants.moodOrdering
      },
      x: {
        timeUnit,
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

  const view = new vega.View(vega.parse(spec), {
    renderer: 'svg',
    container: '#mood-over-time'
  })

  return view.runAsync();
}

/**
 * Select a time bin
 *
 * @param {Object} data
 *
 * @returns {string} a time unit for vega
 */
const selectTimeBin = data => {
  let timeUnit = 'monthdate'

  if (data.stats && data.stats.timeInterval && data.stats.timeInterval.days > 30) {
    timeUnit = 'yearmonthdate'
  }

  return timeUnit
}

/**
 * Plot a heatplot of moods over time
 *
 * @param {Object} data the user's mood data
 */
moodGraphs.line = async data => {
  if (!data.hasOwnProperty('moods')) {
    throw new Error('data did not have moods property')
  }

  const timeUnit = selectTimeBin(data)

  const [$html] = document.getElementsByTagName('html')
  const theme = $html.getAttribute('data-theme') || 'light'

  const moodRanking = [...constants.moodOrdering].reverse()

  const spec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v4.0.0-beta.9.json',
    autosize: { type: 'fit', resize: true },
    data: {
      values: data.moods.map(datum => {
        datum.value = moodRanking.indexOf(datum.mood)
        return datum
      })
    },
    config: getHeatplotConfig(theme),
    layer: [
      {
        mark: {
          type: 'point',
          opacity: 0.2,
          color: getCssVariable('graph-line')
        },
        encoding: {
          y: {
            aggregate: 'average',
            field: 'value',
            type: 'quantitative',
            axis: {
              title: '',
              labelExpr: `${JSON.stringify(moodRanking)}[datum.label]`
            }
          },
          x: {
            timeUnit,
            field: 'timestamp',
            type: 'temporal'
          }
        }
      },
      {
        mark: {
          type: 'line',
          color: getCssVariable('graph-line')
        },
        transform: [
          {
            loess: 'value',
            on: 'timestamp'
          }
        ],
        encoding: {
          y: {
            field: 'value',
            type: 'quantitative',
            axis: {
              title: '',
              labelExpr: `${JSON.stringify(moodRanking)}[datum.label]`
            }
          },
          x: {
            timeUnit,
            field: 'timestamp',
            type: 'temporal'
          }
        }
      }
    ]
  }
}

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
