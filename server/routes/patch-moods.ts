
import * as firebase from './shared/db'
import errors from '@rgrannell/errors'

import ensureLoggedIn from './shared/signin'
import * as validate from './shared/validate-input'

const patchMoods = async (req, res) => {
  const { userId } = await ensureLoggedIn(req, res)

  try {
    var parsed = JSON.parse(req.body)
  } catch (err) {
    throw errors.unprocessableEntity('could not parse request body as json', 422)
  }

  validate.body(userId, parsed)

  await firebase.createUser(userId, req.state)
  await firebase.saveMoods(userId, req.state, parsed.events)

  res.status(200)
  res.end('PATCH api/moods')
}

export default patchMoods
