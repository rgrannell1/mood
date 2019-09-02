
import { local } from '../shared/utils.js'
import constants from '../shared/constants.js'

const initialiseCache = () => {
  const events = local.get(constants.keys.cachedEvents)

  if (typeof events === 'undefined' || events === null) {
    local.set(constants.keys.cachedEvents, [])
  }
}

const cache = {}

cache.addEvent = event => {
  initialiseCache()

  const events = local.get(constants.keys.cachedEvents)

  events.push(event)
  local.set(constants.keys.cachedEvents, events)
}

cache.retrieveEvents = () => {
  initialiseCache()

  const value = local.get(constants.keys.cachedEvents)

  return JSON.parse(value)
}

cache.removeEvents = events => {
  initialiseCache()
}

export default cache
