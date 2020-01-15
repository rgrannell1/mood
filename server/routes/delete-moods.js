
import firebase from './shared/db'
import checkLogin from './services/check-login'

import config from './shared/config'

const envConfig = config()

/**
 * Update a user's mood data
 *
 * @param {Request} req a Request object
 * @param {Response} res a Response object
 *
 */
const deleteMoods = async (req, res) => {
  const { username } = await checkLogin(req, {
    key: envConfig.encryption.key
  })

  const deleteMoodStats = await firebase.moods.delete(username, req.state, {
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

module.exports = deleteMoods
