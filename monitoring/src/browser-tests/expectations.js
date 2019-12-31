
const errors = require('@rgrannell/errors')
const utils = require('../shared/utils')

const expectations = {}

expectations.hasSelector = async (page, selectors) => {
  await utils.waitForSelectors(selectors, page)
}

module.exports = expectations
