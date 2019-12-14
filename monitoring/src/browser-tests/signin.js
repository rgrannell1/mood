
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

const validateLogin = {}

validateLogin.request = async request => {
  const isLogin = request.url().includes('login')

  if (!isLogin) {
    return
  }

  try {
    var postData = JSON.parse(await request.postData())
  } catch (err) {
    const text = await request.postData()
    throw errors.invalidResponseBody(`failed to parse response-body as JSON:\n\n${text}`)
  }

  for (const prop of ['user', 'password']) {
    if (!postData.hasOwnProperty(prop)) {
      throw errors.invalidRequestBody(`login body did not contain property "${prop}"`)
    }
  }

  if (postData.user !== TEST_ACCOUNT_USER) {
    throw errors.invalidRequestBody('login body had wrong username"')
  }
  if (postData.password !== TEST_ACCOUNT_PASSWORD) {
    throw errors.invalidRequestBody('login body had wrong password"')
  }
}

validateLogin.response = async response => {
  const isLogin = response.url().includes('login')

  if (!isLogin) {
    return
  }

  try {
    var body = await response.json()
  } catch (err) {
    const text = await response.text()
    throw errors.invalidResponseBody(`failed to parse response-body as JSON:\n\n${text}`)
  }

  if (!body.hasOwnProperty('logged_in')) {
    throw errors.invalidResponseBody('login call did not contain "logged_in" field')
  }

  if (!body.logged_in) {
    throw errors.invalidResponseBody('login body field "logged_in" was not true')
  }
}

/**
 * Test whether login succeeds for valid credentials
 *
 * @param {Page} page the puppeteer page
 *
 * @returns {Promise<>} a result promise
 */
tests.loginValidCredentials = async page => {
  await page.type('#mood-username', TEST_ACCOUNT_USER)
  await page.type('#mood-password', TEST_ACCOUNT_PASSWORD)

  await page.click('#mood-signin-submit')
  await new Promise((resolve, reject) => {
    page
      .on('request', validateLogin.request)
      .on('response', function handleResponse (response) {
        validateLogin.response(response)

        page.removeListener('request', validateLogin.request)
        page.removeListener('request', handleResponse)

        resolve()
      })
  })

  return Promise.race([
    page.waitForSelector('#mood-box'),
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
