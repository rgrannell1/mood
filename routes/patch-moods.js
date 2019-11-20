
const firebase = require('./shared/db')
const validate = require('./shared/validate-input')
const checkLogin = require('./services/check-login')

const config = require('./shared/config')

const envConfig = config()

const patchMoods = async (req, res) => {
  const body = validate.body(req.body)

  const { username } = await checkLogin(req, {
    key: envConfig.encryption.key
  })

  const saveMoodStats = await firebase.saveMoods(username, req.state, body.events, {
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
