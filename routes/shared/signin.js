
import signale from 'signale'
import * as errors from '@rgrannell/errors'

// check aud is my client id, and iss is accounts.google.com or https version
// if id is verified, dont need to verify

// use sub as user primary key

import config from './config.js'
import { OAuth2Client } from 'google-auth-library'

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

  const payload = ticket.getPayload()
  const userId = payload.sub

  if (payload.aud !== config.google.audience) {
    throw errors.unauthorized('invalid token audience', 401)
  }

  signale.debug('verified user id_token')

  return {
    userId
  }
}

/**
 * throw an error if a user is not successfully logged in
 *
 * @param {Request} req
 * @param {Response} res
 *
 *
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

export default ensureLoggedIn
