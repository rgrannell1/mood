
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
const deleteMoods = async (req: MoodRequest, res: MoodResponse) => {
  const { username } = await checkLogin(req, res, {
    key: envConfig.encryption.key
  })

  const deleteMoodStats = await firebase.moods.delete(username, req.state, {
    key: envConfig.encryption.key
  })

  const response = {
    stats: {
      deleted: deleteMoodStats.deleted
    }
  }

  res.status(200)
  res.end(JSON.stringify(response, null, 2))
}

export default  deleteMoods
