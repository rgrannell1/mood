
const log = require('./shared/log')
const config = require('./shared/config')
const constants = require('./shared/constants')
const validate = require('./shared/validate-input')
const signinUser = require('./services/signin-user')
const errors = require('@rgrannell/errors')
const Cookies = require('cookies')

const envConfig = config()

const postLogin = async (req, res) => {
  const credentials = await validate.signinCredentials(req, res)

  const { sessionId } = await signinUser(credentials, req.state)

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
