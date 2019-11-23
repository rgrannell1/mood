
const puppeteer = require('puppeteer')
const signale = require('signale')
const config = require('./shared/config')()

process.on('unhandledRejection', err => {
  signale.error(`${err.message}\n\n${err.stack}`)
  process.exit(1)
})

//const captureConsoleErrors = require('./capture-console-errors')

const apiTests = require('./api-tests')

async function syntheticMonitoring () {
  const browser = await puppeteer.launch({
    headless: true
  })

  await apiTests(browser, config)

//  await captureConsoleErrors(config, browser)
  // -- play with service worker

  await browser.close()

  const version = 'alpha' // -- TODO
  signale.success(`all deployment ${version} tests passed!`)
}

syntheticMonitoring()
