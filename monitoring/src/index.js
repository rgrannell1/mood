
const puppeteer = require('puppeteer')
const signale = require('signale')
const config = require('./config')()

process.on('unhandledRejection', err => {
  signale.error(`${err.message}\n\n${err.stack}`)
  process.exit(1)
})

const {
  captureViewportScreenshots,
  viewports
} = require('./capture-viewport-screenshots')
const captureConsoleErrors = require('./capture-console-errors')

const apiTests = require('./test-api')

async function main () {
  const browser = await puppeteer.launch()

  // await captureViewportScreenshots(config, browser, viewports)
  await apiTests(config)

  await captureConsoleErrors(config, browser)
  // -- play with service worker

  await browser.close()

  const version = 'alpha' // -- TODO
  signale.success(`all deployment ${version} tests passed!`)
}

main()
