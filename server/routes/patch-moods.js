
import firebase from './shared/db'
import validate from './shared/validate'
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
const patchMoods = async (req, res) => {
  const { username } = await checkLogin(req, {
    key: envConfig.encryption.key
  })

  const body = validate.input.body(req.body)

  const saveMoodStats = await firebase.moods.save(username, req.state, body.events, {
    key: envConfig.encryption.key
  })

  const response = {
    stats: {
      saved: saveMoodStats.saved
    }
  }

  res.status(200)
  res.end(JSON.stringify(response, null, 2))
}

module.exports = patchMoods
