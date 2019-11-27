
const firebase = require('./shared/db')
const validate = require('./shared/validate')
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

  const body = validate.input.body(req.body)

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
