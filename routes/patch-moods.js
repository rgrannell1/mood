
const firebase = require('./shared/db')
const validate = require('./shared/validate-input')
const errors = require('@rgrannell/errors')
const checkLogin = require('./services/check-login')

const config = require('./shared/config')

const envConfig = config()

const patchMoods = async (req, res) => {
  try {
    var parsed = JSON.parse(req.body)
  } catch (err) {
    throw errors.unprocessableEntity('could not parse request body as json', 422)
  }

  const userId = await checkLogin(req, {
    key: envConfig.encryption.key
  })

  validate.body(userId, parsed)

  await firebase.createUser(userId, req.state, {
    key: envConfig.encryption.key
  })
  const saveMoodStats = await firebase.saveMoods(userId, req.state, parsed.events, {
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
