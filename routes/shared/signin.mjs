
import log from './log.mjs'

import * as errors from '@rgrannell/errors'

import config from './config.mjs'
const envConfig = config()

// check aud is my client id, and iss is accounts.google.com or https version
// if id is verified, dont need to verify

// use sub as user primary key

import google from 'google-auth-library'
const { OAuth2Client } = google

const client = new OAuth2Client(envConfig.google.clientId)

const allowSchemes = (schemes, req) => {
  if (!Object.prototype.hasOwnProperty.call(req.headers, 'authorization')) {
    throw errors.unauthorized('"authorization" absent from request requiring authentication', 401)
  }

  const header = req.headers.authorization
  const matchingScheme = schemes.find(scheme => {
    return header.toLowerCase().startsWith(scheme)
  })

  if (!matchingScheme) {
    throw errors.unauthorized('invalid authorization scheme provided', 401)
  }

  return {
    scheme: matchingScheme.toLowerCase(),
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
  if (!password) {
    throw errors.unauthorized('no credential provided for basic-authentication', 401)
  }

  if (password !== envConfig.test.credential) {
    log.warn(req.state, 'unauthenticated basic-auth attempt to access test-account')
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
      audience: envConfig.google.clientId
    })
  } catch (err) {
    if (err.message.includes('Token used too late')) {
      // -- TODO implement refresh mechanism
    } else {
      throw err
    }
  }

  const { sub, aud } = ticket.getPayload()

  if (aud !== envConfig.google.audience) {
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
export default async (req, res) => {
  try {
    const auth = allowSchemes(['basic', 'bearer'], req)

    if (auth.scheme === 'basic') {
      return verify.testCredential(auth.value, req)
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
