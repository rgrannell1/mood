
import * as log from './shared/log'
import config from './shared/config'
import constants from './shared/constants'

import database from './shared/db'

import * as errors from '@rgrannell/errors'
import validate from './shared/validate'

import Cookies from 'cookies'

const envConfig = config()

/**
 * Register a new user
 *
 * @param {Request} req a request object
 * @param {Response} res a response object
 */
const postRegister = async (req: MoodRequest, res: MoodResponse) => {
  const credentials = await validate.input.registerCredentials(req, res)

  await database.user.create(credentials, req.state, {
    key: envConfig.encryption.key
  })

  const { sessionId } = await database.session.create(credentials.username, req.state, {
    key: envConfig.encryption.key
  })

  const cookies = new Cookies(req as any, res as any, {
    keys: envConfig.cookies.keys
  })

  try {
    cookies.set(constants.cookies.session, sessionId, {
      sameSite: 'strict',
      httpOnly: false,
      signed: true
    })

    log.success(req.state, `login session created for user ${req.state.userId}`)
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

export default postRegister
