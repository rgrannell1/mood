
/**
 * Typed wrapper for localstorage
 */
const local = {
  set(key, value) {
    return localStorage.setItem(key, JSON.stringify(value))
  },
  get(key) {
    return JSON.parse(localStorage.getItem(key))
  }
}

export default local
