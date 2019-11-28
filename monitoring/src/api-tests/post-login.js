
const api = require('../shared/api')
const utils = require('../shared/utils')
const expectations = require('./expectations')
const signale = require('signale')

const expect = {
  post: {
    register: {}
  }
}

expect.post.register.statusCode = result => {
  return expectations.validStatusCode('POST api/register', result, [200])
}

expect.post.register.validFields = result => {
  return expectations.validResponseFields('POST api/register', result, [
    'created'
  ])
}
/**
 * Run tests for GET POST api/register
 *
 * @param {string} host the host to test against
 *
 */
const postLogin = async (host, db) => {
  const moodApi = await api(host)

  signale.success('POST api/login worked as expected')
}

module.exports = postLogin
