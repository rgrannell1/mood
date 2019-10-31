
import firebase from './shared/db.mjs'
import validate from './shared/validate-input.mjs'
import errors from '@rgrannell/errors'
import checkLogin from './services/check-login.mjs'


import config from './shared/config.mjs'

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

export default patchMoods
