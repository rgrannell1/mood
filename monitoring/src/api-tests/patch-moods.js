
const api = require('../shared/api')
const expectations = require('./expectations')
const signale = require('signale')
const dotenv = require('dotenv').config()

const { TEST_ACCOUNT_USER } = dotenv.parsed
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

const expect = {
  patch: {
    moods: {}
  }
}

expect.patch.moods.unauthorizedStatusCode = result => {
  return expectations.validStatusCode('PATCH api/moods', result, [401])
}

expect.patch.moods.statusCode = result => {
  return expectations.validStatusCode('PATCH api/moods', result, [200])
}

expect.patch.moods.validFields = result => {
  return expectations.validResponseFields('PATCH api/moods', result, [
    'stats'
  ])
}

const tests = {}

tests.noCookie = async ({ api, db, userId }) => {
  const result = await api.patch.moods(null)
  await expect.patch.moods.unauthorizedStatusCode(result)
}

tests.badCookie = async ({ api, db, userId }) => {
  const result = await api.patch.moods('invalid_cookie')
  await expect.patch.moods.unauthorizedStatusCode(result)
}

/**
 * Post two moods and check the response value
 *
 * @package {Object} object
 *
 */
tests.patchTwoMoods = async ({ api, db, userId }) => {
  const result = await api.patch.moods(body)

  await expect.patch.moods.statusCode(result)
  await expect.patch.moods.validFields(result)
}

/**
 * Run tests for PATCH /api/moods
 *
 * @param {string} host the host to test against
 */
const patchMoods = async (host, db) => {
  const moodApi = await api(host)

  const args = {
    api: moodApi,
    db,
    userId: TEST_ACCOUNT_USER
  }

  await tests.noCookie(args)
  await tests.badCookie(args)
  await tests.patchTwoMoods(args)

  signale.success('PATCH api/moods worked as expected')
}

module.exports = patchMoods
