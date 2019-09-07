'use strict'
exports.__esModule = true
var errors = require('@rgrannell/errors')
var constants = require('./constants')
exports.mood = function (event, ith) {
  for (var _i = 0, _a = ['type', 'mood', 'timestamp']; _i < _a.length; _i++) {
    var prop = _a[_i]
    if (!event.hasOwnProperty(prop)) {
      throw errors.unprocessableEntity(ith + 'th event was missing property "' + prop + '"', 422)
    }
  }
  if (event.type !== 'send-mood') {
    throw errors.unprocessableEntity(ith + 'th event type was "' + event.type + '"', 422)
  }
}
exports.body = function (userId, content) {
  if (!content.hasOwnProperty('events')) {
    throw errors.unprocessableEntity('request body was missing field "events"', 422)
  }
  if (!Array.isArray(content.events)) {
    throw errors.unprocessableEntity('request body "events" property was not an array', 422)
  }
  if (content.events.length > constants.limits.moodsLength) {
    throw errors.requestEntityTooLarge('too many events sent to server in one batch', 413)
  }
  content.events.forEach(function (event, ith) {
    exports.mood(event, ith)
  })
  return content
}
