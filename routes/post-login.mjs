
import log from './shared/log.mjs'
import firebase from './shared/db.mjs'
import config from './shared/config.mjs'
import createUser from './services/create-user.mjs'
import errors from '@rgrannell/errors'

const envConfig = config()

const validateLoginCredentials = async (req, res) => {
  try {
    var body = JSON.parse(req.body)
  } catch (err) {
    throw errors.badRequest('Invalid JSON login request body provided', 400)
  }

  if (!body.user) {
    throw errors.unprocessableEntity('Empty user value provided', 422)
  }
  if (!body.password) {
    throw errors.unprocessableEntity('Empty password value provided', 422)
  }
  if (body.password.length < 14) {
    throw errors.unprocessableEntity('Insuffienctly long password provided', 422)
  }

  return {
    userName: body.user,
    password: body.password
  }
}

const postLogin = async (req, res) => {
  const credentials = await validateLoginCredentials(req, res)

  await createUser(credentials, req.state, {
    key: envConfig.encryption.key
  })


}

export default postLogin
