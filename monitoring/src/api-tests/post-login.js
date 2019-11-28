
const api = require('../shared/api')
const utils = require('../shared/utils')
const expectations = require('./expectations')
const signale = require('signale')
const errors = require('@rgrannell/errors')

const expect = {
  post: {
    login: {}
  }
}

expect.post.login.statusCode = result => {
  return expectations.validStatusCode('POST api/login', result, [200])
}

expect.post.login.validHeaders = result => {
  const headers = [...result.headers.entries()]
  const [_, cookies] = headers.find(pair => pair[0] === 'set-cookie')

  if (!cookies.includes('mood-session.sig')) {
    throw errors.invalidCookie('missing expected cookie mood-session.sig')
  }
  if (!cookies.includes('mood-session')) {
    throw errors.invalidCookie('missing expected cookie mood-session')
  }
}

expect.post.login.validFields = result => {
  return expectations.validResponseFields('POST api/login', result, [
    'logged_in'
  ])
}
/**
 * Run tests for GET POST api/login
 *
 * @param {string} host the host to test against
 *
 */
const postLogin = async (host, db) => {
  const moodApi = await api(host)

  const user = 'register_test_user'
  const password = 'register_test_password'

  await moodApi.post.register({ user, password })

  const result = await moodApi.post.login({ user, password })

  await expect.post.login.statusCode(result)
  await expect.post.login.validFields(result)
  await expect.post.login.validHeaders(result)

  signale.success('POST api/login worked as expected')
}

module.exports = postLogin
