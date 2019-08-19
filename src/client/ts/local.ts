
/**
 * Typed wrapper for localstorage
 */
const local = {
  set<T>(key:string, value:T) {
    return localStorage.setItem(key, JSON.stringify(value))
  },
  get<T>(key:string):T {
    return JSON.parse(localStorage.getItem(key) as string)
  }
}

export default local
