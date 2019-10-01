
const captureConsoleErrors = async (config, browser) => {
  const page = await browser.newPage()
  await page.goto('https://mood.rgrannell2.now.sh')

  // -- todo
}

module.exports = captureConsoleErrors
