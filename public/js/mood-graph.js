
const readMoodData = (opts = { from = 'now', mood = 'now-30d' }) => {
  // fetch

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
    : mappings['Neutral']
}

const findDateBounds = date => {
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
    date: Date.parse('26 Aug 16:11 00:12:00 GMT'),
    mood: 'bad'
  },
  {
    date: Date.parse('25 Aug 16:11 00:12:00 GMT'),
    mood: 'bad'
  },
  {
    date: Date.parse('24 Aug 16:11 00:12:00 GMT'),
    mood: 'bad'
  },
  {
    date: Date.parse('23 Aug 16:11 00:12:00 GMT'),
    mood: 'decent'
  },
  {
    date: Date.parse('22 Aug 16:11 00:12:00 GMT'),
    mood: 'stellar'
  },
  {
    date: Date.parse('21 Aug 16:11 00:12:00 GMT'),
    mood: 'stellar'
  }
]

const renderMoodData = (data, opts) => {
  const timeBounds = findDateBounds(xata)

  // -- todo
}

export default {
  renderMoodData,
  readMoodData
}
