
import { local } from '../shared/utils.js'

/**
 *
 * Log out of mood, and clear all local information
 * storage.
 */
const logout = () => {
  document.cookie = ''
  local.clear()
}

export default logout
