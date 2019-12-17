
const errors = require('@rgrannell/errors')
const expectations = require('./expectations')
const signale = require('signale')
const dotenv = require('dotenv').config()
const utils = require('../shared/utils')

const {
  TEST_ACCOUNT_USER,
  TEST_ACCOUNT_PASSWORD
} = dotenv.parsed

const tests = {}

tests.hasSelectors = async page => {
  await page.click('#mood-create-account')

  const selectors = [
    '#mood-signup',
    '#mood-input-form',
    '#mood-username',
    '#mood-password',
    '#mood-password-repeat',
    '#mood-signup-submit',
    '#mood-create-account',
    '#dark-mode-toggle'
  ]

  return expectations.hasSelector(page, selectors)
}

const registerTests = async (host, db, browser) => {
  await tests.hasSelectors(await utils.moodPage(browser, host))
}

module.exports = registerTests
