
const def = { from: 'now', mood: 'now-30d' }

export const readMoodData = (opts = def) => {
  return fetch('api/moods', {
    method: 'GET',
    qs: { from, to }
  })
}

const asRanking = mood => {
  const mappings = {
    atrocious: 0,
    'in pain': 1,
    ennui: 2,
    bad: 3,
    neutral: 4,
    decent: 5,
    fine: 6,
    stellar: 7
  }

  return mappings.hasOwnProperty(mood.toLowerCase())
    ? mappings[mood]
    : mappings.neutral
}

const minBy = (data, fn) => {
  const selected = {
    value: null,
    metric: Infinity
  }
  for (const datum of data) {
    const metric = fn(datum)

    if (metric < selected.metric) {
      selected.value = datum
      selected.metric = metric
    }
  }

  return selected.value
}

const maxBy = (data, fn) => {
  const selected = {
    value: null,
    metric: -Infinity
  }
  for (const datum of data) {
    const metric = fn(datum)

    if (metric > selected.metric) {
      selected.value = datum
      selected.metric = metric
    }
  }

  return selected.value
}

const findDateBounds = data => {
  const to = maxBy(data, datum => datum.date.getTime())
  const from = minBy(data, datum => datum.date.getTime())

  return {
    to: to ? to.date : null,
    from: from ? from.date : null
  }
}

const addOffsets = (data, bounds) => {
  return data.map(datum => {
    return {
      ...datum,
      offset: datum.date.getTime() - bounds.from.getTime()
    }
  })
}

const xata = [
  {
    date: new Date(1e11),
    mood: 'bad'
  },
  {
    date: new Date(2e11),
    mood: 'bad'
  },
  {
    date: new Date(3e11),
    mood: 'decent'
  },
  {
    date: new Date(4e11),
    mood: 'stellar'
  },
  {
    date: new Date(45e11),
    mood: 'stellar'
  }
]

export const renderMoodData = (data, opts) => {
  const bounds = findDateBounds(xata)
  const withOffsets = addOffsets(xata, bounds)

  const { offset: maxOffset } = maxBy(withOffsets, datum => datum.offset)

  const coords = withOffsets.map(datum => {
    return {
      x: datum.offset / maxOffset,
      y: asRanking(datum.mood)
    }
  })

  // scale, add axis
}

renderMoodData()
