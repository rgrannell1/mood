
const fetch = require('node-fetch')
const signale = require('signale')
const errors = require('@rgrannell/errors')

/**
 * Run tests for GET /api/metadata
 *
 * @param {string} host the host to test against
 *
 */
const deleteMetadata = async host => {
  const result = await fetch(`${host}/api/moods`, {
    method: 'DELETE'
  })
  const responseBody = await result.text()

  // -- check the status works as expected
  if (result.status !== 200) {
    throw errors.invalidStatusCode(`DELETE api/moods returned unexpected status-code ${result.status}:\n${responseBody}`)
  }

  try {
    var parsed = JSON.parse(responseBody)
  } catch (err) {
    throw errors.invalidResponseBody('DELETE api/moods body did not parse as JSON')
  }

  // -- check the response body
  if (!parsed.version) {
    throw errors.invalidResponseBody('DELETE api/moods was missing property version')
  }

  signale.success('DELETE api/moods worked as expected')
}

module.exports = deleteMetadata
