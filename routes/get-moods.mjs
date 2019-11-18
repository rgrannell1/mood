
import firebase from './shared/db.mjs'
import config from './shared/config.mjs'
import checkLogin from './services/check-login.mjs'

const envConfig = config()

const getMoods = async (req, res) => {
  const userId = await checkLogin(req, {
    key: envConfig.encryption.key
  })

  const moods = await firebase.getMoods(userId, req.state, {
    key: envConfig.encryption.key
  })

  res.status(200)
  res.end(JSON.stringify(moods))
}

export default getMoods
