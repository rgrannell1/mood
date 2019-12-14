
const expectations = require('./expectations')
const signale = require('signale')

const tests = {}

tests.hasSelectors = async page => {
  const selectors = [
    '#mood-signin',
    '#mood-input-form',
    '#mood-username',
    '#mood-password',
    '#mood-signin-error',
    '#mood-signin-submit',
    '#mood-create-account'
  ]

  return expectations.hasSelector(page, selectors)
}

const signinTests = async (host, db, browser) => {
  const page = await browser.newPage()

  await page.goto(host)

  await tests.hasSelectors(page)

  signale.success('browser signin worked as expected')
}

module.exports = signinTests
