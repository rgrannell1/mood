
const nanoid = require('nanoid')
const crypto = require('crypto')

const constants = require('./constants')

/**
 * Create a request-tracking id, to uniquely identify a function
 *
 * @returns {string} an id
 */
module.exports.trackingId = () => {
  return nanoid(constants.sizes.trackingId)
}

const phonemes = [
  'ba', 'be', 'bi', 'bo', 'bu', 'by', 'da', 'de', 'di', 'do', 'du', 'dy', 'fa',
  'fe', 'fi', 'fo', 'fu', 'fy', 'ga', 'ge', 'gi', 'go', 'gu', 'gy', 'ha', 'he',
  'hi', 'ho', 'hu', 'hy', 'ja', 'je', 'ji', 'jo', 'ju', 'jy', 'ka', 'ke', 'ki',
  'ko', 'ku', 'ky', 'la', 'le', 'li', 'lo', 'lu', 'ly', 'ma', 'me', 'mi', 'mo',
  'mu', 'my', 'na', 'ne', 'ni', 'no', 'nu', 'ny', 'pa', 'pe', 'pi', 'po', 'pu',
  'py', 'ra', 're', 'ri', 'ro', 'ru', 'ry', 'sa', 'se', 'si', 'so', 'su', 'sy',
  'ta', 'te', 'ti', 'to', 'tu', 'ty', 'va', 've', 'vi', 'vo', 'vu', 'vy', 'bra',
  'bre', 'bri', 'bro', 'bru', 'bry', 'dra', 'dre', 'dri', 'dro', 'dru', 'dry',
  'fra', 'fre', 'fri', 'fro', 'fru', 'fry', 'gra', 'gre', 'gri', 'gro', 'gru',
  'gry', 'pra', 'pre', 'pri', 'pro', 'pru', 'pry', 'sta', 'ste', 'sti', 'sto',
  'stu', 'sty', 'tra', 'tre']

module.exports.sessionId = () => {
  return nanoid(constants.sizes.sessionId)
}

module.exports.userId = () => {
  const chars = []

  for (let ith = 0; ith < 8; ++ith) {
    var phoneme = phonemes[Math.floor(Math.random() * phonemes.length)]
    chars.push(phoneme)
  }

  return chars.join('')
}

/**
 *  Hash a value
 *
 * @param {string} string an arbitrary string
 */
module.exports.hash = string => {
  return crypto.createHash('sha512').update(string).digest('base64')
}

module.exports.asKoremutake = num => {
  if (num < 0) {
    throw new Error('require a positive number')
  } else if (num === 0) {
    return phonemes[0]
  }

  let digits = []
  const plen = phonemes.length

  while (num > 0) {
    const digit = num % plen
    num = Math.floor(num / plen)

    digits = [phonemes[digit]].concat(digits)
  }

  return digits.join('')
}
