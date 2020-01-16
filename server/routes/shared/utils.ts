
import nanoid from 'nanoid'
import * as crypto from 'crypto'

import constants from './constants'

/**
 * Create a request-tracking id, to uniquely identify a function
 *
 * @returns {string} an id
 */
export const trackingId = () => {
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

export const sessionId = ():string => {
  return nanoid(constants.sizes.sessionId)
}

/**
 * Generate a user ID
 *
 * @returns {string} a random-id
 */
export const userId = ():string => {
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
 *
 * @returns {string} a hashed string
 */
export const hash = (string:string):string => {
  return crypto.createHash('sha512').update(string).digest('base64')
}

export const dataRoles = {
  reader (userId:string|number) {
    return {
      [userId]: 'reader'
    }
  }
}
