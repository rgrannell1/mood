
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
const callWithToken = fn => {
  const token = local.get(constants.keys.googleToken)

  return fn(token)
}

/**
 * Post cached events to the server.
 *
 * @returns {Promise<Response>} a fetch response
 */
api.moods.post = async () => {
  const events = cache.retrieveEvents()

  console.log(`syncing ${events.length} events to server`)

  const response = await callWithToken(token => {
    return fetch(`${constants.apiHost}/api/moods`, {
      method: 'PATCH',
      body: asBody({
        events
      })
    })
  })

  if (response.status === 200) {
    cache.removeEvents(events)
  }
}

/**
 * Fetch moods for a user from the server.
 *
 * @returns {Promise<Response>} a fetch response
 */
api.moods.get = async () => {
  return callWithToken(token => {
    return fetch(`${constants.apiHost}/api/moods`, {
      method: 'GET'
    })
  })
}

export { api }
