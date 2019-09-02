

import signale from 'signale'
import * as errors from '@rgrannell/errors'

// take id token
// decode with google client libraries
// check aud is my client id, and iss is accounts.google.com or https version
// if id is verified, dont need to verify

// use sub as user primary key

import path from 'path'
import constants from './constants.js'
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
const verifyToken = async token => {
  if (!token) {
    throw errors.unprocessableEntity(`id_token was not supplied alongside request to server`, 422)
  }

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: config.google.clientId
  })
  const payload = ticket.getPayload()
  const userId = payload.sub

  signale.debug('verified user id_token')

  return {
    userId
  }
}

const ensureLoggedIn = async (req, res) => {
  try {
    verifyToken(req.headers['x-auth-token'])
  } catch (err) {
    // -- send http errors if couldn't verify login.
    console.error(err)
  }
}

export default ensureLoggedIn
