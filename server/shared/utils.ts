
import * as crypto from 'crypto'

/**
 * Create a request-tracking id, to uniquely identify a function
 *
 * @returns {string} an id
 */
export const trackingId = (): string => {
  return crypto.randomBytes(16).toString('base64')
}

/**
 *  Hash a value
 *
 * @param {string} string an arbitrary string
 */
export const hash = (content: string): string => {
  return crypto.createHash('sha512').update(content).digest('base64')
}
