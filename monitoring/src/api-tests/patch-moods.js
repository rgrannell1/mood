
const fetch = require('node-fetch')
const signale = require('signale')
const errors = require('@rgrannell/errors')
const dotenv = require('dotenv').config()

/**
 * Run tests for PATCH /api/moods
 *
 * @param {string} host the host to test against
 */
const patchMoods = async (cookies, host, db) => {
  const body = {
    events: [
      {
        type: 'send-mood',
        mood: 'Ennui',
        timestamp: new Date(1000000000000)
      },
      {
        type: 'send-mood',
        mood: 'Stellar',
        timestamp: new Date(2000000000000)
      }
    ]
  }

  const result = await fetch(`${host}/api/moods`, {
    method: 'PATCH',
    headers: {
      Cookie: cookies
    },
    body: JSON.stringify(body)
  })

  const responseBody = await result.text()

  // -- check the status works as expected
  if (result.status !== 200) {
    throw errors.invalidStatusCode(`PATCH api/moods returned unexpected status-code ${result.status}:\n${responseBody}`)
  }

  // todo get moods before, after, and get stats

  try {
    var parsed = JSON.parse(responseBody)
  } catch (err) {
    throw errors.invalidResponseBody('PATCH api/moods body did not parse as JSON')
  }

  if (!parsed.stats) {
    throw errors.invalidResponseBody('PATCH api/moods body did not have property "stats"')
  }

  signale.success('PATCH api/moods worked as expected')
}

module.exports = patchMoods
