
const fetch = require('node-fetch')
const puppeteer = require('puppeteer')
const signale = require('signale')
const config = require('./shared/config')()

process.on('unhandledRejection', err => {
  signale.error(`${err.message}\n\n${err.stack}`)
  process.exit(1)
})

const apiTests = require('./api-tests')

/**
 * Run synthetic monitoring
 */
async function syntheticMonitoring () {
  const browser = await puppeteer.launch({
    headless: true
  })

  await apiTests(browser, config)

  await browser.close()

  const result = await fetch(`${config.staticHost}/api/metadata`)
  const { version } = await result.json()

  signale.success(`all tests for deployment ${version} passed.`)
}

syntheticMonitoring()
