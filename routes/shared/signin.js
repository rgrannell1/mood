
const log = require('./log')
const errors = require('@rgrannell/errors')

// check aud is my client id, and iss is accounts.google.com or https version
// if id is verified, dont need to verify

// use sub as user primary key

const config = require('./config')
const { OAuth2Client } = require('google-auth-library')

const client = new OAuth2Client(config.google.clientId)

/**
 * Ensure that a user is logged in through Google.
 *
 * @param {string} an ID token supplied by the front-end.
 *
 * @returns {object} data about the user
 */
const verifyToken = async req => {
  if (!req.headers.hasOwnProperty('authorization')) {
    throw errors.unauthorized('"authorization" absent from request requiring authentication', 401)
  }

  let token
  const prefix = 'Bearer'
  const header = req.headers.authorization

  if (header.startsWith(prefix)) {
    token = header.slice(prefix.length).trim()
  }

  if (!token) {
    throw errors.unauthorized('id_token was not supplied alongside request to server', 401)
  }

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: config.google.clientId
  })

  const { sub, aud } = ticket.getPayload()

  if (aud !== config.google.audience) {
    throw errors.unauthorized('invalid token audience', 401)
  }

  req.state.userId = sub
  log.debug(req.state, 'verified user id_token')

  return {
    userId: sub
  }
}

/**
 * throw an error if a user is not successfully logged in
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<*>}
 */
const ensureLoggedIn = async (req, res) => {
  try {
    return verifyToken(req)
  } catch (err) {
    // -- send http errors if couldn't verify login.
    console.error(err)
    throw err
  }
}

module.exports = ensureLoggedIn
