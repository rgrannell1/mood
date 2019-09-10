
const log = require('./log')
const errors = require('@rgrannell/errors')
const config = require('./config')

// check aud is my client id, and iss is accounts.google.com or https version
// if id is verified, dont need to verify

// use sub as user primary key

const config = require('./config')
const { OAuth2Client } = require('google-auth-library')

const client = new OAuth2Client(config.google.clientId)

const allowSchemes = (schemes, req) => {
  if (!req.headers.hasOwnProperty('authorization')) {
    throw errors.unauthorized('"authorization" absent from request requiring authentication', 401)
  }

  const header = req.headers.authorization
  const matchingScheme = schemes.find(scheme => header.startsWith(scheme))

  if (!matchingScheme) {
    throw errors.unauthorized('invalid authorization scheme provided', 401)
  }

  return {
    scheme: matchingScheme,
    value: header.slice(matchingScheme.length).trim()
  }
}

const verify = {}

/**
 * To aid testing without aggrevating Google's bot detection, and
 * alternative basic-auth login pathway is provided for a single test account.
 *
 * @param {object} req a request object
 *
 */
verify.testCredential = async (password, req) => {
  if (password !== config.test.credential) {
    log.warn(req.state, 'unauthenticated attempt to access test-account')
    throw errors.unauthorized('invalid basic-auth credential provided', 401)
  }

  return {
    userId: 'synthetic_monitoring_account'
  }
}

/**
 * Ensure that a user is logged in through Google.
 *
 * @param {string} an ID token supplied by the front-end.
 *
 * @returns {object} data about the user
 */
verify.token = async (token, req) => {
  if (!token) {
    throw errors.unauthorized('id_token was not supplied alongside request to server', 401)
  }

  try {
    var ticket = await client.verifyIdToken({
      idToken: token,
      audience: config.google.clientId
    })
  } catch (err) {
    if (err.message.includes('Token used too late')) {
      // -- TODO implement refresh mechanism
    } else {
      throw err
    }
  }

  const { sub, aud } = ticket.getPayload()

  if (aud !== config.google.audience) {
    throw errors.unauthorized('invalid token audience', 500)
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
    const auth = allowSchemes(['basic', 'bearer'], req)

    if (auth.scheme === 'basic') {
      return verify.testCredential(req)
    } else if (auth.scheme === 'bearer') {
      return verify.token(auth.value, req)
    } else {
      throw new errors.internalServerError('invalid authentication scheme provided', 500)
    }
  } catch (err) {
    // -- send http errors if couldn't verify login.
    console.error(err)
    throw err
  }
}

module.exports = ensureLoggedIn
