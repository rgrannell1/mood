
const Cookies = require('cookies')
const config = require('../shared/config')
const constants = require('../shared/constants')
const errors = require('@rgrannell/errors')

const envConfig = config()

const checkLogin = async (req, res, opts) => {
  const cookies = new Cookies(req, res, {
    keys: envConfig.cookies.keys
  })

  // Set the cookie to a value
  const session = cookies.get(constants.cookies.session, {
    signed: true
  })

  if (!session) {
    throw errors.authorization('no session-cookie provided', 401)
  }
}

module.exports = checkLogin
