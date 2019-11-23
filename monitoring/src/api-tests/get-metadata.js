
const fetch = require('node-fetch')
const signale = require('signale')
const errors = require('@rgrannell/errors')

/**
 * Run tests for GET /api/metadata
 *
 * @param {string} host the host to test against
 *
 */
const getMetadata = async host => {
  const result = await fetch(`${host}/api/metadata`)
  const responseBody = await result.text()

  // -- check the status works as expected
  if (result.status !== 200) {
    throw errors.invalidStatusCode(`GET api/metadata returned unexpected status-code ${result.status}:\n${responseBody}`)
  }

  try {
    var parsed = JSON.parse(responseBody)
  } catch (err) {
    throw errors.invalidResponseBody('GET api/metadata body did not parse as JSON')
  }

  // -- check the response body
  if (!parsed.version) {
    throw errors.invalidResponseBody('GET api/metadata was missing property version')
  }

  signale.success('GET api/metadata worked as expected')
}

module.exports = getMetadata
