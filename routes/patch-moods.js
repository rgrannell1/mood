
// require('dotenv').config()

const firebase = require('./shared/db')
const ensureLoggedIn = require('./shared/signin')
const validate = require('./shared/validate-input')

const patchMoods = async (req, res) => {
  const { userId } = await ensureLoggedIn(req, res)

  try {
    var parsed = JSON.parse(req.body)
  } catch (err) {
    throw errors.unprocessableEntity('could not parse request body as json', 422)
  }

  const moods = validate.body(userId, parsed)

  await firebase.createUser(userId, req.state)
  await firebase.saveMoods(userId, req.state, moods)

  res.status(200)
  res.end('PATCH api/moods')
}

module.exports = patchMoods
