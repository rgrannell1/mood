
const fetch = require('node-fetch')
const signale = require('signale')
const errors = require('@rgrannell/errors')
const dotenv = require('dotenv').config()

/**
 * Run tests for GET /api/moods
 *
 * @param {string} host the host to test against
 */
const getMoods = async host => {
  const result = await fetch(`${host}/api/moods`, {
    headers: {
      Authorization: `Basic ${dotenv.parsed.TEST_ACCOUNT_CREDENTIAL}`
    }
  })
  const responseBody = await result.text()

  // -- check the status works as expected
  if (result.status !== 200) {
    throw errors.invalidStatusCode(`GET api/moods returned unexpected status-code ${result.status}:\n${responseBody}`)
  }

  try {
    var parsed = JSON.parse(responseBody)
  } catch (err) {
    throw errors.invalidResponseBody('GET api/metadata body did not parse as JSON')
  }

  signale.success('GET api/moods worked as expected')
}

module.exports = getMoods
