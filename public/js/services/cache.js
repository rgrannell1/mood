
import { local } from '../shared/utils.js'
import constants from '../shared/constants.js'

/**
 * Set up the cache as required
 */
const initialiseCache = () => {
  const events = local.get(constants.keys.cachedEvents)

  if (typeof events === 'undefined' || events === null) {
    local.set(constants.keys.cachedEvents, [])
  }
}

const cache = {}

/**
 * Add an event to the cache
 */
cache.addEvent = event => {
  initialiseCache()

  const events = local.get(constants.keys.cachedEvents)

  events.push(event)
  local.set(constants.keys.cachedEvents, events)
}

/**
 * Return all events in the current cache
 *
 * @returns {Array<Object>}
 */
cache.retrieveEvents = () => {
  initialiseCache()

  const value = local.get(constants.keys.cachedEvents)

  return JSON.parse(value)
}

/**
 * Remove all events in a list from the current cache.
 */
cache.removeEvents = events => {
  initialiseCache()

  const current = cache.retrieveEvents()

  const deleted = new Set(events.map(event => event.id))
  const filtered = current.filter(candidate => !deleted.has(candidate.id))

  local.set(constants.keys.cachedEvents, filtered)
}

export default cache
