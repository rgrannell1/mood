
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
