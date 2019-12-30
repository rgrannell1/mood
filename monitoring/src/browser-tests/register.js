
const errors = require('@rgrannell/errors')
const expectations = require('./expectations')
const dotenv = require('dotenv').config()
const utils = require('../shared/utils')

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
    '#mood-login-account',
    '#dark-mode-toggle'
  ]

  return expectations.hasSelector(page, selectors)
}

/**
 * Check that clicking the Sign In link brings you to the login page.
 *
 * @param {Page} page the puppeteer page
 *
 * @returns {Promise<>} a result promise
 */
tests.redirectToLogin = async page => {
  await page.click('#mood-login-account')

  const [$elem] = await page.$$('#mood-signup .mood-h2')

  if (!$elem) {
    throw errors.invalidPageContent('h2 element not found')
  }

  const content = await page.evaluate(elem => elem.textContent, $elem)

  if (!content || content !== 'Sign In') {
    throw errors.invalidPageContent(`h2 content was expected to be "Sign In" but was "${content}"`)
  }
}

const registerTests = async (host, db, browser) => {
  await tests.hasSelectors(await utils.moodPage(browser, host))
  await tests.redirectToLogin(await utils.moodPage(browser, host))
}

module.exports = registerTests
