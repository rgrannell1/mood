
import { local } from '../shared/utils.js'
import cache from '../services/cache.js'
import constants from '../shared/constants.js'

const api = {
  moods: {}
}

/**
 * convert an object to a string.
 *
 * @param {Object} value
 */
const asBody = value => {
  return JSON.stringify(value, null, 2)
}

/**
 * Retrieve a token and call an underlying REST method
 *
 * @param {Function} fn call a function with a fetched token
 */
const withToken = fn => {
  const token = local.get(constants.keys.googleToken)

  if (token) {
    return fn(token)
  } else {
    throw new Error('token was absent, so could not log in')
  }
}

/**
 * Post cached events to the server.
 *
 * @returns {Promise<Response>} a fetch response
 */
api.moods.post = async () => {
  console.log('⛏ syncing events to server')

  const events = cache.retrieveEvents()

  const response = withToken(token => {
    return fetch(`${constants.apiHost}/api/moods`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: asBody({
        events
      })
    })
  })

  // -- if successful, wipe results from cache.
  cache.removeEvents(events)
}

/**
 * Fetch moods for a user from the server.
 *
 * @returns {Promise<Response>} a fetch response
 */
api.moods.get = async () => {
  return withToken(token => {
    return fetch(`${constants.apiHost}/api/moods`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  })
}

export { api }
