
import queryString from 'querystring'

import firebase from './shared/db.mjs'
import errors from '@rgrannell/errors'

const createUserSession = async (req, res) => {
  try {
    var body = JSON.parse(req.body)
  } catch (err) {
    throw errors.badRequest('Invalid JSON login request body provided', 400)
  }

  if (!body.user) {
    throw errors.unprocessableEntity('Empty user value provided', 422)
  }
  if (!body.password) {
    throw errors.unprocessableEntity('Empty password value provided', 422)
  }
  if (body.password.length < 14) {
    throw errors.unprocessableEntity('Insuffienctly long password provided', 422)
  }

  // -- create user, create a session
}

const postLogin = async (req, res) => {
  await createUserSession(req, res)


  // -- set cookie?
}

export default postLogin
