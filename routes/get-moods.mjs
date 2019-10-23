
import firebase from './shared/db.mjs'
import config from './shared/config.mjs'
import basicAuth from './shared/auth.mjs'

const envConfig = config()

const getMoods = async (req, res) => {
  const userId = await basicAuth(req, res)

  const moods = await firebase.getMoods(userId, req.state, {
    key: envConfig.encryption.key
  })

  res.status(200)
  res.end(JSON.stringify(moods))
}

export default getMoods
