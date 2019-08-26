
const readMoodData = () => {
  // fetch

  return fetch({
    // -- get between two date bounds
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

const renderMoodData = data => {

}

export default {
  renderMoodData,
  readMoodData
}
