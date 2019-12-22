
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
 * Post cached events to the server.
 *
 * @returns {Promise<Response>} a fetch response
 */
api.moods.post = async () => {
  const events = cache.retrieveEvents()

  console.log(`syncing ${events.length} events to server`)

  const response = await fetch(`${constants.apiHost}/api/moods`, {
    method: 'PATCH',
    credentials: 'include',
    body: asBody({ events })
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
  return fetch(`${constants.apiHost}/api/moods`, {
    method: 'GET',
    credentials: 'include'
  })
}

export { api }
