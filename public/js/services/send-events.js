
import local from './local.js'
import constants from '../shared/constants.js'

async function sendEvents () {
  console.log('⛏ syncing events to server')
  const events = local.get('cached-events')

  const body = JSON.stringify({ events }, null, 2)

  const token = local.get(constants.keys.googleToken)

  if (token) {
    return fetch('api/moods', {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body
    })
  } else {
    throw new Error('token was absent, so could not log in')
  }
}

export { sendEvents }
