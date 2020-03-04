

import vegaEmbed from 'vega-embed'
import constants from '../../shared/constants'

import {
  getGraphConfig,
  getCssVariable
} from '../../shared/utils'

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
 * Plot a line plot of moods over time
 *
 * @param {Object} data the user's mood data
 *
 * @returns {Object} a spec object
 */
export default async data => {
  if (!data.hasOwnProperty('moods')) {
    throw new Error('data did not have moods property')
  }

  const timeUnit = selectTimeBin(data)

  const [$html] = document.getElementsByTagName('html')
  const theme = $html.getAttribute('data-theme') || 'light'

  const moodRanking = constants.moods.map(data => data.name)

  const spec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v4.0.0-beta.9.json',
    autosize: { type: 'fit', resize: true },
    data: {
      values: data.moods.map(datum => {
        datum.value = moodRanking.indexOf(datum.mood)
        return datum
      })
    },
    config: getGraphConfig(theme),
    layer: [
      {
        mark: {
          type: 'point',
          opacity: 0.2,
          filled: true,
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

  vegaEmbed('#mood-over-time', spec, {
    renderer: 'svg',
    height: 200,
    width: 400
  })
}

