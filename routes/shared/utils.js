
import nanoid from 'nanoid'
import crypto from 'crypto'

import constants from './constants.js'

export const trackingId = () => {
  return nanoid(constants.sizes.trackingId)
}

export const hash = string => {
  return crypto.createHash('sha512').update(string).digest('base64')
}