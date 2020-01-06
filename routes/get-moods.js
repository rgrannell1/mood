
const firebase = require('./shared/db')
const config = require('./shared/config')
const log = require('./shared/log')
const checkLogin = require('./services/check-login')

const envConfig = config()

/**
 * Get mood data for a user
 *
 * @param {Request} req a Request object
 * @param {Response} res a Response object
 *
 */
const getMoods = async (req, res) => {
  const { username } = await checkLogin(req, {
    key: envConfig.encryption.key
  })

  const moods = await firebase.moods.get(username, req.state, {
    key: envConfig.encryption.key
  })

  log.success(req.state, `retrieved ${moods.stats.count} mood records`)

  res.status(200)
  res.end(JSON.stringify(moods))
}

module.exports = getMoods
