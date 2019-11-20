
import { local } from '../shared/utils.js'
import constants from '../shared/constants.js'

const handlers = {}

/**
 * set up ID token when signed in correctly
 */
handlers.onSuccess = user => {
  console.log('setting google id token')

  const authResponse = user.getAuthResponse()
console.log(authResponse)

  // -- should be refactored.
  local.set(constants.keys.googleToken, authResponse.id_token)
}

/**
 * report the error to the user
 *
 * @param err {Error} the login error
 */
handlers.onFailure = err => {
  console.error(err)
}

/**
 * load gooogle signin
 */
const addLogin = () => {

}

export { addLogin }
