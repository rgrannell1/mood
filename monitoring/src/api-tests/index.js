
const dotenv = require('dotenv').config()

const tests = {
  getMetadata: require('./get-metadata'),
  patchMoods: require('./patch-moods'),
  getMoods: require('./get-moods')
}

/**
 * Retreive a session-cookie to authenticate with API
 *
 * @param {Page} page a page object
 *
 * @returns {Promise<string>} a result promise containing a cookie-header
 */
const retrieveMoodCookies = page => {
  const retrieveCookies = new Promise(resolve => {
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

  return Promise.race([
    retrieveCookies
  ])
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
 * @param {Object} browser the static-site host
 * @param {Object} config configuration for the api tests.
 *
 * @returns {Promise<>} a result promise
 */
const apiTests = async (browser, config, db) => {
  const cookies = await retrieveCookie(browser, config.staticHost)

  await tests.getMetadata(config.apiHost)
  await tests.getMoods(cookies, config.apiHost, db)
  await tests.patchMoods(cookies, config.apiHost, db)
}

module.exports = apiTests
