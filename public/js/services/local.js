
/**
 * Typed wrapper for localstorage
 */
const local = {
/**
 * set a value in localstorage
 *
 * @param {string} key the property name
 * @param {string} value the property value
 */
  set (key, value) {
    return localStorage.setItem(key, JSON.stringify(value))
  },
  /**
 * set a value in localstorage
 *
 * @param {string} key the property name
 *
 * @returns {string} the value stored in localstorage
 */
  get (key) {
    return JSON.parse(localStorage.getItem(key))
  }
}

export default local
