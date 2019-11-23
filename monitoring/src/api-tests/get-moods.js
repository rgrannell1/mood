

const utils = require('../shared/utils')
const fetch = require('node-fetch')
const signale = require('signale')
const errors = require('@rgrannell/errors')
const dotenv = require('dotenv').config()

const { TEST_ACCOUNT_USER } = dotenv.parsed

const expect = {}

expect.validResponseFields = body => {
  try {
    var parsed = JSON.parse(body)
  } catch (err) {
    throw errors.invalidResponseBody('GET api/moods body did not parse as JSON')
  }

  if (!parsed.moods) {
    throw errors.invalidResponseBody('GET api/moods body did not have property "moods"')
  }
  if (!parsed.stats) {
    throw errors.invalidResponseBody('GET api/moods body did not have property "stats"')
  }

  return parsed
}

expect.okStatusCode = result => {
  // -- check the status works as expected
  if (result.status !== 200) {
    throw errors.invalidStatusCode(`GET api/moods returned unexpected status-code ${result.status}:\n${responseBody}`)
  }
}

const tests = {}

tests.getZeroEntries = async ({ host, cookies, db, userId }) => {
  await utils.deleteMoods(db, userId)

  const result = await fetch(`${host}/api/moods`, {
    headers: {
      Cookie: cookies
    }
  })

  expect.okStatusCode(result)

  const responseBody = await result.text()
  const parsed = expect.validResponseFields(responseBody)

  if (parsed.stats.count !== 0) {
    throw errors.invalidResponseData(`expected to have zero entries, but ${parsed.stats.count} detected`)
  }
}

tests.getTwoEntries = async ({ host, cookies, db, userId }) => {
  await utils.deleteMoods(db, userId)

  await utils.patchMoods(db, userId, utils.data.moods)

  const result = await fetch(`${host}/api/moods`, {
    headers: {
      Cookie: cookies
    }
  })

  expect.okStatusCode(result)

  const responseBody = await result.text()
  const parsed = expect.validResponseFields(responseBody)

  if (parsed.stats.count !== 2) {
    throw errors.invalidResponseData(`expected to have two entries, but ${parsed.stats.count} detected`)
  }
}

// TESTS: DELETE THEN GET 0
// TESTS: DELETE THEN POST THEN GET IS N THEN DELETE IS 0

/**
 * Run tests for GET /api/moods
 *
 * @param {string} host the host to test against
 */
const getMoods = async (cookies, host, db) => {
  const args = {
    host,
    cookies,
    db,
    userId: TEST_ACCOUNT_USER
  }
  await tests.getZeroEntries(args)
  await tests.getTwoEntries(args)

  signale.success('GET api/moods worked as expected')
}

//  const moods = await utils.getMoods(db, TEST_ACCOUNT_USER)

//  if (moods.length !== parsed.stats.count) {
//    throw errors.invalidResponseData(`GET api/moods length mismatched (actually ${moods.length}, got ${parsed.stats.count})`)
//  }

module.exports = getMoods
