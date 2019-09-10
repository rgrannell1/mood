
const puppeteer = require('puppeteer')
const {
  captureViewportScreenshots,
  viewports
} = require('./capture-viewport-screenshots')

const apiTests = require('./api-tests')

async function main () {
  const browser = await puppeteer.launch()

  await captureViewportScreenshots(browser, viewports)
  await apiTests()

  // -- perform end-to-end test
  // -- capture login times
  // -- capture console errors
  // -- play with service worker

  await browser.close()
}

main()
