
import firebase from './shared/db'
import config from './shared/config'
import * as log from './shared/log'
import checkLogin from './services/check-login'

const envConfig = config()

/**
 * Get mood data for a user
 *
 * @param {Request} req a Request object
 * @param {Response} res a Response object
 *
 */
const getMoods = async (req:MoodRequest, res:MoodResponse) => {
  const { username } = await checkLogin(req, res, {
    key: envConfig.encryption.key
  })

  const moods = await firebase.moods.get(username, req.state, {
    key: envConfig.encryption.key
  })

  log.success(req.state, `retrieved ${moods.stats.count} mood records`)

  res.status(200)
  res.end(JSON.stringify(moods))
}

export default getMoods
