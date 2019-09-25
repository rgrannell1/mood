
/**
 *
 * @param {string} mood
 */
const pointColour = mood => {
  const cssVar = val => {
    return window.getComputedStyle(document.documentElement).getPropertyValue(`--${val}`)
  }

  const label = mood.toLowerCase().replace(' ', '-')
  return cssVar(`graph-colour-${label}`)
}

const moods = [
  'Stellar',
  'Fine',
  'Decent',
  'Neutral',
  'Bad',
  'Ennui',
  'In pain',
  'Atrocious'
]

const moodGraphs = {}

/**
 * Draw a scatterplot to the canvas
 *
 * @param {Object}
 */
moodGraphs.scatterplot = async data => {

}

export default moodGraphs
