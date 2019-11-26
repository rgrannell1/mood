
const api = require('../shared/api')
const expectations = require('./expectations')
const signale = require('signale')
const dotenv = require('dotenv').config()

const { TEST_ACCOUNT_USER } = dotenv.parsed

const expect = {
  delete: {
    moods: {}
  }
}

expect.delete.moods.unauthorizedStatusCode = result => {
  return expectations.validStatusCode('DELETE api/moods', result, [401])
}

expect.delete.moods.statusCode = result => {
  return expectations.validStatusCode('DELETE api/moods', result, [200])
}

expect.delete.moods.validFields = result => {
  return expectations.validResponseFields('DELETE api/moods', result, [
    'stats'
  ])
}

const tests = {}

tests.noCookie = async ({ api, db, userId }) => {
  const result = await api.delete.moods(null)
  await expect.delete.moods.unauthorizedStatusCode(result)
}

tests.badCookie = async ({ api, db, userId }) => {
  const result = await api.delete.moods('invalid_cookie')
  await expect.delete.moods.unauthorizedStatusCode(result)
}

tests.deleteAllMoods = async ({ api, db, userId }) => {
  const result = await api.delete.moods()

  await expect.delete.moods.statusCode(result)
  await expect.delete.moods.validFields(result)
}

/** * Run tests for DELETE /api/moods
 *
 * @param {string} host the host to test against
 *
 */
const deleteMetadata = async (host, db) => {
  const moodApi = await api(host)

  const args = {
    api: moodApi,
    db,
    userId: TEST_ACCOUNT_USER
  }

  await tests.noCookie(args)
  await tests.badCookie(args)

  await tests.deleteAllMoods(args)

  signale.success('DELETE api/moods worked as expected')
}

module.exports = deleteMetadata
