
const dotenv = require('dotenv').config()

const tests = {
  getMetadata: require('./get-metadata'),
  patchMoods: require('./patch-moods'),
  getMoods: require('./get-moods')
}

const retrieveMoodCookies = page => {
  return new Promise(resolve => {
    page.on('response', async request => {
      const url = request.url()

      if (!url.endsWith('/api/login')) {
        return
      }

      const cookies = await page.cookies()
      const moodCookies = cookies.filter(cookie => {
        return cookie.name.startsWith('mood-session')
      })

      const cookieHeader = moodCookies.map(cookie => {
        return `${cookie.name}=${cookie.value}`
      }).join(';')

      resolve(cookieHeader)
    })
  })
}

/**
 * Retrieve a cookie by signing into the page, for
 * authentication use elsewhere.
 *
 * @param {Object} browser the static-site host
 * @param {string} host the static-site host
 */
const retrieveCookie = async (browser, host) => {
  const page = await browser.newPage()
  await page.goto(host)

  const { TEST_ACCOUNT_USER, TEST_ACCOUNT_PASSWORD } = dotenv.parsed

  await page.waitForSelector('#mood-username')
  await page.type('#mood-username', TEST_ACCOUNT_USER)

  await page.waitForSelector('#mood-password')
  await page.type('#mood-password', TEST_ACCOUNT_PASSWORD)

  await page.click('#mood-signin-submit')

  return retrieveMoodCookies(page)
}

/**
 * Run all API tests concurrently
 *
 * @param {Object} config configuration for the api tests.
 *
 * @returns {Promise<>} a result promise
 */
const apiTests = async (browser, config) => {
  const cookies = await retrieveCookie(browser, config.staticHost)

  return Promise.all([
    tests.getMetadata(config.apiHost),
    tests.patchMoods(cookies, config.apiHost),
    tests.getMoods(cookies, config.apiHost)
  ])
}

module.exports = apiTests
