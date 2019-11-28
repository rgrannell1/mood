
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
const postRegister = async (host, db) => {
  const moodApi = await api(host)

  const user = 'register_test_user'
  const password = 'register_test_password'
  await utils.deleteUser(db, user)

  const result = await moodApi.post.register({ user, password })

  await expect.post.register.statusCode(result)
  await expect.post.register.validFields(result)

  signale.success('POST api/register worked as expected')
}

module.exports = postRegister
