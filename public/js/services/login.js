
import { local } from '../shared/utils.js'
import constants from '../shared/constants.js'

const handlers = {}

/**
 * set up ID token when signed in correctly
 */
handlers.onSuccess = user => {
  console.log('setting google id token')

  const authResponse = user.getAuthResponse()

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
window.onload = function () {
  console.log('setting up google login.')

  if (!gapi) {
    console.error('failed to load gapi')
  }

  gapi.load('auth2', () => {
    const api = gapi.auth2.init({
      clientId: constants.google.clientId
    })

    const $button = document.querySelector('#google-signin')

    api.attachClickHandler($button, {}, handlers.onSuccess, handlers.onFailure)
  })
}
