
import Cookies from 'cookies'
import config from '../shared/config'
import constants from '../shared/constants'
import * as log from '../shared/log'
import firebase from '../shared/db'
import * as errors from '@rgrannell/errors'

const envConfig = config()

/**
 * Return session information for a user, or throw an error if they weren't
 * authenticated correctly.
 *
 * @param {Request} req a request
 * @param {Response} res a response
 * @param {Object} opts firebase config
 */
const checkLogin = async (req: MoodRequest, res: MoodResponse, opts: FirebaseOpts):Promise<MoodSession> => {
  const cookies = new Cookies(req as any, res as any, {
    keys: envConfig.cookies.keys
  })

  // Set the cookie to a value
  const sessionId:string | undefined = cookies.get(constants.cookies.session, {
    signed: true
  })

  if (!sessionId) {
    throw errors.authorization('no session-id found in session-cookie', 401)
  }

  const session = await firebase.session.get(sessionId, req.state, opts)

  log.debug(req.state, `session cookie received for ${session.username}`)

  return session
}

export default checkLogin
