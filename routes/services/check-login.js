
const Cookies = require('cookies')
const config = require('../shared/config')
const constants = require('../shared/constants')
const log = require('../shared/log')
const firebase = require('../shared/db')
const errors = require('@rgrannell/errors')

const envConfig = config()

const checkLogin = async (req, res, opts) => {
  const cookies = new Cookies(req, res, {
    keys: envConfig.cookies.keys
  })

  // Set the cookie to a value
  const sessionId = cookies.get(constants.cookies.session, {
    signed: true
  })

  if (!sessionId) {
    throw errors.authorization('no session-cookie provided', 401)
  }

  const session = await firebase.getSession(sessionId, req.state, opts)

  log.debug(req.state, `session cookie received for ${session.username}`)

  return session
}

module.exports = checkLogin
