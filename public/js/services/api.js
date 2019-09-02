
import local from './local.js'
import constants from '../shared/constants.js'

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
    fn(token)
  } else {
    throw new Error('token was absent, so could not log in')
  }
}

api.moods.post = async () => {
  console.log('⛏ syncing events to server')
  const events = local.get('cached-events')

  const body = JSON.stringify({ events }, null, 2)

  withToken(token => {
    return fetch('api/moods', {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body
    })
  })
}

api.moods.get = async () => {
  withToken(token => {
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
