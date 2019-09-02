
import { local } from '../shared/utils.js'
import constants from '../shared/constants.js'

const cache = {}

const api = {
  moods: {}
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
  const events = local.get('cached-events')

  const body = JSON.stringify({ events }, null, 2)

  return withToken(token => {
    return fetch('api/moods', {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body
    })
  })
}

/**
 * Fetch moods for a user from the server.
 *
 * @returns {Promise<Response>} a fetch response
 */
api.moods.get = async () => {
  return withToken(token => {
    return fetch('api/moods', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      },
      qs: { from, to }
    })
  })
}

export { api }
