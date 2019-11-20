
const log = require('./shared/log')
const config = require('./shared/config')
const constants = require('./shared/constants')
const createUser = require('./services/create-user')
const errors = require('@rgrannell/errors')
const Cookies = require('cookies')

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

  const { sessionId } = await createUser(credentials, req.state, {
    key: envConfig.encryption.key
  })

  const cookies = new Cookies(req, res, {
    keys: envConfig.cookies.keys
  })

  try {
    cookies.set(constants.cookies.session, sessionId, {
      sameSite: 'strict',
      httpOnly: false,
      signed: true
    })

    log.success(req.ctx, `login session created for user ${req.state.userId}`)
  } catch (err) {
    console.error(err)
    throw errors.internalServerError('failed to create cookie session', 500)
  }

  res.writeHead(200)
  res.end()
}

module.exports = postLogin