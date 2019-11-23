
const tests = {
  getMetadata: require('./get-metadata'),
  patchMoods: require('./patch-moods'),
  getMoods: require('./get-moods')
}

/**
 * Run all API tests concurrently
 *
 * @param {Object} config configuration for the api tests.
 *
 * @returns {Promise<>} a result promise
 */
const apiTests = async config => {
  return Promise.all([
    tests.getMetadata(config.apiHost),
    tests.patchMoods(config.apiHost),
    tests.getMoods(config.apiHost)
  ])
}

module.exports = apiTests
