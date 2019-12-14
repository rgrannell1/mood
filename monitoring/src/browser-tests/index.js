
const tests = {
  register: require('./register'),
  signin: require('./signin')
}

/**
 * Run all browser tests concurrently
 *
 * @param {Object} browser the static-site host
 * @param {Object} config configuration for the api tests.
 *
 * @returns {Promise<>} a result promise
 */
const browserTests = async (browser, config, db) => {
  await tests.signin(config.staticHost, db, browser)
  await tests.register(config.staticHost, db, browser)
}

module.exports = browserTests
