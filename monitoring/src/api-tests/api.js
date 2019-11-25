
const fetch = require('node-fetch')
const dotenv = require('dotenv').config()
const puppeteer = require('puppeteer')

const api = {
  get: {},
  delete: {},
  patch: {}
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
 *
 * @param {string} host the API host
 */
const moodApi = async host => {
  const browser = await puppeteer.launch()

  const cookie = await retrieveCookie(browser, host)

  await browser.close()

  api.get.moods = () => {
    return fetch(`${host}/api/moods`, {
      headers: {
        Cookie: cookie
      }
    })
  }

  api.get.metadata = () => {
    return fetch(`${host}/api/metadata`)
  }

  api.delete.moods = () => {
    return fetch(`${host}/api/moods`, {
      method: 'DELETE',
      headers: {
        Cookie: cookie
      }
    })
  }

  api.patch.moods = body => {
    return fetch(`${host}/api/moods`, {
      method: 'PATCH',
      headers: {
        Cookie: cookie
      },
      body: JSON.stringify(body)
    })
  }

  return api
}

module.exports = moodApi
