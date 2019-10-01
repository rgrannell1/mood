
import firebase from './shared/db.mjs'
import ensureLoggedIn from './shared/signin.mjs'
import validate from './shared/validate-input.mjs'

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
