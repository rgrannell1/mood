
// take id token
// decode with google client libraries
// check aud is my client id, and iss is accounts.google.com or https version
// if id is verified, dont need to verify

// use sub as user primary key

import path from 'path'
import constants from './constants.js'
import config from '@rgrannell/config'

import OAuth2Client from 'google-auth-library'

const environment = 'default'
const values = config(environment, {
  root: constants.paths.root
})
const client = new OAuth2Client(values.google.clientId)

/**
 * Ensure that a user is logged in through Google.
 *
 * @param {string} an ID token supplied by the front-end.
 *
 * @returns {object} data about the user
 */
const verifyToken = async token => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: values.google.clientId
  })
  const payload = ticket.getPayload()
  const userId = payload.sub

  return {
    userId
  }
}

const ensureLoggedIn = async (req, res) => {
  try {
    verifyToken(req.headers.Authorization)
  } catch (err) {
    // -- send http errors if couldn't verify login.
    console.error(err)
  }
}

export default ensureLoggedIn
