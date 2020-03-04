
import dayjs from 'dayjs'

import constants from '../../shared/constants'

import {
  getGraphConfig,
  getCssVariable
} from '../../shared/utils'
import { truthy } from 'vega'

/**
 * Plot a pixel graph of the year's moods
 *
 * @param {Object} data the user's mood data
 */

const width = 40
const height = 40
const margin = 10

// -- todo
const getMood = (data, month, day) => {
  const entries = data.moods.filter(datum => {
    const parts = {
      month: dayjs(datum.timestamp).format('MMM'),
      day: dayjs(datum.timestamp).format('D'),
      year: dayjs(datum.timestamp).format('YYYY')
    }

    const sameMonth = `${month}` === parts.month
    const sameDay = `${day}` === parts.day
    const sameYear = true

    return sameMonth && sameDay && sameYear
  })

  if (!entries) {
    return 'lightgrey'
  }

  const average = Math.round(entries.map(datum => datum.value) / entries.length)

  return [
    '#0A2F51',
    '#0E4D64',
    '#137177',
    '#188977',
    '#1D9A6C',
    '#39A96B',
    '#56B870',
    '#74C67A',
    '#99D492'
  ][average]
}

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Opt',
  'Nov',
  'Dev'
]

const monthLengths = {
  Feb: 29,
  Apr: 30,
  Jun: 30,
  Sep: 30,
  Nov: 30
}

const getTilePosition = (monthNumber, dayNumber) => {
  return {
    x: monthNumber * (width + margin),
    y: dayNumber * (height + margin)
  }
}

const drawAxes = ctx => {
  months.forEach((month, monthNumber) => {
    const x = monthNumber * (width + margin)

    ctx.font = '15px Sans'
    ctx.fillStyle = 'black'
    ctx.fillText(month, x, 30)
    ctx.stroke()
  })
}

const drawTiles = (data, ctx, canvas) => {
  months.forEach((month, monthNumber) => {
    const monthLength = monthLengths[month] || 31

    for (let dayNumber = 1; dayNumber <= 31; ++dayNumber) {
      let { x, y } = getTilePosition(monthNumber, dayNumber)

      let isInvalid = dayNumber >= monthLength

      ctx.fillStyle = isInvalid
        ? 'lightgrey'
        : getMood(data, month, dayNumber)

      ctx.fillRect(x, y, width, height)
      ctx.stroke()
    }
  })
}

export default async data => {
  const canvas = document.getElementById('mood-pixels-graph')
  const ctx = canvas.getContext('2d')

  drawAxes(ctx)
  drawTiles(data, ctx, canvas)
}
