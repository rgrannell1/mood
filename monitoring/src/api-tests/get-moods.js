
const api = require('../shared/api')
const expectations = require('./expectations')
const utils = require('../shared/utils')
const signale = require('signale')
const errors = require('@rgrannell/errors')
const dotenv = require('dotenv').config()

const { TEST_ACCOUNT_USER } = dotenv.parsed

const expect = {
  get: {
    moods: {}
  }
}

expect.get.moods.statusCode = result => {
  return expectations.validStatusCode('GET api/moods', result, [200])
}

expect.get.moods.validFields = result => {
  return expectations.validResponseFields('GET api/moods', result, [
    'moods',
    'stats'
  ])
}

const tests = {}

/**
 * Post zero moods and check the correct values are returned.
 *
 * @package {Object} object
 *
 */
tests.getZeroEntries = async ({ api, db, userId }) => {
  await utils.deleteMoods(db, userId)

  const result = await api.get.moods()

  await expect.get.moods.statusCode(result)

  const parsed = await expect.get.moods.validFields(result)

  if (parsed.stats.count !== 0) {
    throw errors.invalidResponseData(`expected to have zero entries, but ${parsed.stats.count} detected`)
  }
}

/**
 * Post two moods and check the correct values are returned.
 *
 * @package {Object} object
 *
 */
tests.getTwoEntries = async ({ api, db, userId }) => {
  await utils.deleteMoods(db, userId)

  await utils.patchMoods(db, userId, utils.data.moods)

  const result = await api.get.moods()

  await expect.get.moods.statusCode(result)

  const parsed = await expect.get.moods.validFields(result)

  if (parsed.stats.count !== 2) {
    throw errors.invalidResponseData(`expected to have two entries, but ${parsed.stats.count} detected`)
  }
}

/**
 * Run tests for GET /api/moods
 *
 * @param {string} host the host to test against
 */
const getMoods = async (host, db) => {
  const moodApi = await api(host)

  const args = {
    api: moodApi,
    db,
    userId: TEST_ACCOUNT_USER
  }
  await tests.getZeroEntries(args)
  await tests.getTwoEntries(args)

  signale.success('GET api/moods worked as expected')
}

module.exports = getMoods
