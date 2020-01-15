
import log from './shared/log'
import config from './shared/config'
import constants from './shared/constants'
import createUser from './services/create-user'

import database from './shared/db'

const errors = require('@rgrannell/errors')
import validate from './shared/validate'

import Cookies from 'cookies'

const envConfig = config()

/**
 * Register a new user
 *
 * @param {Request} req a request object
 * @param {Response} res a response object
 */
const postRegister = async (req, res) => {
  const credentials = await validate.input.registerCredentials(req, res)

  const { sessionId } = await database.user.create(credentials, req.state, {
    key: envConfig.encryption.key
  })

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
    created: true
  }

  res.setHeader('Content-Type', 'application/json')
  res.writeHead(200)
  res.end(JSON.stringify(body, null, 2))
}

module.exports = postRegister
