
import dayjs from 'dayjs'

import { api } from '../shared/api'

const getDateString = date => {
  const isSameYear = dayjs(date).format('YYYY') === `${dayjs().year()}`

  if (isSameYear) {
    return `${dayjs(date).format('ddd MMM D')}`
  } else {
    return `${dayjs(date).format('MMM D YYYY')}`
  }
}

const groupedByDate = moods => {
  const grouped = {}

  for (const datum of moods) {
    const date = dayjs(new Date(datum.timestamp))
    const current = getDateString(date)

    if (!grouped[current]) {
      grouped[current] = [datum]
    } else {
      grouped[current].push(datum)
    }
  }

  return grouped
}

export default () => {
  return api.moods.get()
    .then(res => res.json())
    .then(data => groupedByDate(data.moods.reverse()))
}
