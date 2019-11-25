
const api = require('./api')
const expectations = require('./expectations')
const signale = require('signale')

const expect = {
  get: {
    metadata: {}
  }
}

expect.get.metadata.statusCode = result => {
  return expectations.validStatusCode('GET api/metadata', result, [200])
}

expect.get.metadata.validFields = result => {
  return expectations.validResponseFields('GET api/metadata', result, [
    'version'
  ])
}
/**
 * Run tests for GET /api/metadata
 *
 * @param {string} host the host to test against
 *
 */
const getMetadata = async host => {
  const moodApi = await api(host)
  const result = await moodApi.get.metadata()

  await expect.get.metadata.statusCode(result)
  await expect.get.metadata.validFields(result)

  signale.success('GET api/metadata worked as expected')
}

module.exports = getMetadata
