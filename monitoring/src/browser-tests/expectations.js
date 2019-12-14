
const errors = require('@rgrannell/errors')

const expectations = {}

expectations.hasSelector = async (page, selectors) => {
  for (const selector of selectors) {
    const $elem = await page.$(selector)

    if (!$elem) {
      throw errors.missingSelector(`page was missing selector "${selector}"`)
    }
  }
}

module.exports = expectations
