
import nanoid from 'nanoid'
import crypto from 'crypto'

import constants from './constants.mjs'

/**
 * Create a request-tracking id, to uniquely identify a function
 *
 * @returns {string} an id
 */
export const trackingId = () => {
  return nanoid(constants.sizes.trackingId)
}

/**
 *  Hash a value
 *
 * @param {string} string an arbitrary string
 */
export const hash = string => {
  return crypto.createHash('sha512').update(string).digest('base64')
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

export const asKoremutake = num => {
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
