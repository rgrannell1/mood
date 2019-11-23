
const firebase = require('./shared/db')
const checkLogin = require('./services/check-login')

const config = require('./shared/config')

const envConfig = config()

/**
 * Update a user's mood data
 *
 * @param {Request} req a Request object
 * @param {Response} res a Response object
 *
 */
const patchMoods = async (req, res) => {
  const { username } = await checkLogin(req, {
    key: envConfig.encryption.key
  })

  const deleteMoodStats = await firebase.deleteMoods(username, req.state, {
    key: envConfig.encryption.key
  })

  const response = {
    stats: {
      saved: deleteMoodStats.saved
    }
  }

  res.status(200)
  res.end(JSON.stringify(response, null, 2))
}

module.exports = patchMoods
