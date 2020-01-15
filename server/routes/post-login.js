
import log from './shared/log'
import config from './shared/config'
import constants from './shared/constants'
import validate from './shared/validate'
import signinUser from './services/signin-user'
const errors = require('@rgrannell/errors')
import Cookies from 'cookies'

const envConfig = config()

/**
 * Log in a user
 *
 * @param {Request} req a request object
 * @param {Response} res a response object
 */
const postLogin = async (req, res) => {
  const credentials = await validate.input.signinCredentials(req, res)

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

  const body = {
    logged_in: true
  }

  res.setHeader('Content-Type', 'application/json')
  res.writeHead(200)
  res.end(JSON.stringify(body, null, 2))
}

module.exports = postLogin
