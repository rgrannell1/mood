
const { local } = require('../shared/utils.js')
const constants = require('../shared/constants.js')

const cache = {}

cache.addEvent = event => {
  const events = local.get(constants.keys.cachedEvents)

  if (typeof cache === 'undefined' || cache === null) {
    local.set(constants.keys.cachedEvents, [])
  }

  events.push(event)
  local.set(constants.keys.cachedEvents, events)
}

cache.retrieveEvents = () => {
  return local.get(constants.kets.cachedEvents)
}

cache.removeEvents = events => {

}

export default cache
