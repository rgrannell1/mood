
const firebase = require('./shared/db')
const config = require('./shared/config')
const checkLogin = require('./services/check-login')

const envConfig = config()

const getMoods = async (req, res) => {
  const { username } = await checkLogin(req, {
    key: envConfig.encryption.key
  })

  const moods = await firebase.getMoods(username, req.state, {
    key: envConfig.encryption.key
  })

  res.status(200)
  res.end(JSON.stringify(moods))
}

module.exports = getMoods
