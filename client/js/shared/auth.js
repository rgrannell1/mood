
/**
 * Is there an existing session on this page?
 *
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return document.cookie.includes('mood-session.sig')
}
