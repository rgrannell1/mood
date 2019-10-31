
import Cookies from 'cookies'
import config from '../shared/config.mjs'
import errors from '@rgrannell/errors'

const envConfig = config()

const checkLogin = async (req, res, opts) => {
  const cookies = new Cookies(req, res, {
    keys: envConfig.cookies.keys
  })

  // Set the cookie to a value
  const session = cookies.get('session', {
    signed: true
  })

  if (!session) {
    throw errors.authorization('no session-cookie provided', 401)
  }
}

export default checkLogin
