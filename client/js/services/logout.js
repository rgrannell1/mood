
/**
 *
 * Log out of mood, and clear all local information
 * storage.
 */
const logout = () => {
  document.cookie = ''
  localStorage.clear()
}

export default logout
