
const errors = require('@rgrannell/errors')
const utils = require('../shared/utils')

const expectations = {}

expectations.hasSelector = async (page, selectors) => {
  for (const selector of selectors) {
    try {
      await page.waitForSelector(selector, {
        timeout: 5 * 1000
      })
    } catch (err) {
      await utils.showHtml(page)
    }
  }
}

module.exports = expectations
