
const log = require('./shared/log')
const config = require('./shared/config')
const constants = require('./shared/constants')
const createUser = require('./services/create-user')
const errors = require('@rgrannell/errors')
const Cookies = require('cookies')
const validate = require('./shared/validate-input')

const envConfig = config()

const postRegister = async (req, res) => {
  const credentials = await validate.registerCredentials(req, res)

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

module.exports = postRegister
