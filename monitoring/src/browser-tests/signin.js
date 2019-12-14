
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
  const selectors = [
    '#mood-signin',
    '#mood-input-form',
    '#mood-username',
    '#mood-password',
    '#mood-signin-error',
    '#mood-signin-submit',
    '#mood-create-account',
    '#dark-mode-toggle'
  ]

  return expectations.hasSelector(page, selectors)
}

/**
 * Test whether login succeeds for valid credentials
 *
 * @param {Page} page the puppeteer page
 */
tests.loginValidCredentials = async page => {
  await page.type('#mood-username', TEST_ACCOUNT_USER)
  await page.type('#mood-password', TEST_ACCOUNT_PASSWORD)

  const submitCredentials = Promise.all([
    page.click('#mood-signin-submit'),
    page.waitForSelector('#mood-box')
  ])

  return Promise.race([
    submitCredentials,
    utils.timeoutError(errors.missingSelector('could not find selector "#moodBox"'), 10 * 1000)
  ])
}

const signinTests = async (host, db, browser) => {
  const page = await browser.newPage()

  await page.goto(host)

  await tests.hasSelectors(page)
  await tests.loginValidCredentials(page)

  signale.success('browser signin worked as expected')
}

module.exports = signinTests
