
const tests = {
  getMetadata: require('./get-metadata'),
  patchMoods: require('./patch-moods'),
  getMoods: require('./get-moods'),
  deleteMoods: require('./delete-moods'),
  postRegister: require('./post-register'),
  postLogin: require('./post-login'),
  checkTls: require('./tls')
}

/**
 * Run all API tests concurrently
 *
 * @param {Object} browser the static-site host
 * @param {Object} config configuration for the api tests.
 *
 * @returns {Promise<>} a result promise
 */
const apiTests = async (browser, config, db) => {
//  await tests.deleteMoods(config.apiHost, db)
//  await tests.getMetadata(config.apiHost)
//  await tests.getMoods(config.apiHost, db)
//  await tests.patchMoods(config.apiHost, db)
//  await tests.postRegister(config.apiHost, db)
//  await tests.postLogin(config.apiHost, db)
  await tests.checkTls(config.staticHost, db)
}

module.exports = apiTests
