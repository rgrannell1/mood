
const puppeteer = require('puppeteer')
const signale = require('signale')

const {
  captureViewportScreenshots,
  viewports
} = require('./capture-viewport-screenshots')
const captureConsoleErrors = require('./capture-console-errors')

const apiTests = require('./test-api')

async function main () {
  const browser = await puppeteer.launch()

  await captureViewportScreenshots(browser, viewports)
  await apiTests()

  await captureConsoleErrors(browser)
  // -- play with service worker

  await browser.close()

  const version = 'alpha' // -- TODO
  signale.success(`all deployment ${version} tests passed!`)
}

main()
