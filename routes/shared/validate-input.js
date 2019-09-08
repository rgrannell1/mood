
const errors = require('@rgrannell/errors')

const constants = require('./constants')

const validate = {}

validate.mood = (event, ith) => {
  for (const prop of ['type', 'mood', 'timestamp']) {
    if (!event.hasOwnProperty(prop)) {
      throw errors.unprocessableEntity(`${ith}th event was missing property "${prop}"`, 422)
    }
  }

  if (event.type !== 'send-mood') {
    throw errors.unprocessableEntity(`${ith}th event type was "${event.type}"`, 422)
  }

}

validate.body = (userId, content) => {
  if (!content.hasOwnProperty('events')) {
    throw errors.unprocessableEntity('request body was missing field "events"', 422)
  }

  if (!Array.isArray(content.events)) {
    throw errors.unprocessableEntity('request body "events" property was not an array', 422)
  }

  if (content.events.length > constants.limits.moodsLength) {
    throw errors.requestEntityTooLarge('too many events sent to server in one batch', 413)
  }

  content.events.forEach((event, ith) => {
    validate.mood(event, ith)
  })

  return content
}

module.exports = validate