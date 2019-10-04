
import firebase from './shared/db.mjs'
import ensureLoggedIn from './shared/signin.mjs'
import validate from './shared/validate-input.mjs'
import errors from '@rgrannell/errors'

import config from './shared/config.mjs'
const envConfig = config()

const patchMoods = async (req, res) => {
  const { userId } = await ensureLoggedIn(req, res)

  try {
    var parsed = JSON.parse(req.body)
  } catch (err) {
    throw errors.unprocessableEntity('could not parse request body as json', 422)
  }

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
