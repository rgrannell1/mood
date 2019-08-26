
const readMoodData = (opts = { from = 'now', mood = 'now-30d' }) => {
  return fetch('api/moods', {
    method: 'GET',
    qs: { from, to }
  })
}

const asRanking = mood => {
  const mappings = {
    'atrocious': 0,
    'in pain': 1,
    'ennui': 2,
    'bad': 3,
    'neutral': 4,
    'decent': 5,
    'fine': 6,
    'stellar': 7
  }

  return mappings.hasOwnProperty(mood.toLowerCase())
    ? mappings[mood]
    : mappings['neutral']
}

const findDateBounds = data => {
  return data.reduce((acc, curr) => {
    const data = {}

    if (acc.from == null) {
      data.from = curr.date
    }
    if (acc.to == null) {
      data.to = curr.date
    }

    if (curr.data > acc.to) {
      data.to = curr.date
    } else if (curr.date < acc.from) {
      data.from = curr.date
    }

    return data
  }, {
      from: null,
      to: null
    })
}

const xata = [
  {
    date: new Date(0),
    mood: 'bad'
  },
  {
    date: new Date(1e5),
    mood: 'bad'
  },
  {
    date: new Date(2e5),
    mood: 'bad'
  },
  {
    date: new Date(3e5),
    mood: 'decent'
  },
  {
    date: new Date(4e5),
    mood: 'stellar'
  },
  {
    date: new Date(45e5),
    mood: 'stellar'
  }
]

const bucketData = (data, bounds) => {
  const timestamps = {
    to: bounds.to.getTime(),
    from: bounds.from.getTime()
  }



}

const renderMoodData = (data, opts) => {
  const timeBounds = findDateBounds(data)
  const bounds = bucketData(data, timeBounds)

  // -- todo; automatically bucket information? Probably
  // -- include a loess curve though the whole thing
}
export default {
  renderMoodData,
  readMoodData
}
