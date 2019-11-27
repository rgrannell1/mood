
const errors = require('@rgrannell/errors')
const constants = require('./constants')

const validate = {}

validate.mood = (event, ith) => {
  if (event.type !== 'send-mood') {
    throw errors.unprocessableEntity(`${ith}th event type was "${event.type}"`, 422)
  }

  for (const prop of ['type', 'mood', 'timestamp']) {
    if (!event.hasOwnProperty(prop)) {
      throw errors.unprocessableEntity(`${ith}th event was missing property "${prop}"`, 422)
    }

    if (!event[prop]) {
      throw errors.unprocessableEntity(`${ith}th event had empty or falsy property "${prop}"`, 422)
    }
  }
}

const is = val => {
  return Object.prototype.toString.call(val).slice(8, -1).toLowerCase()
}

validate.body = body => {
  const bodyType = is(body)

  if (bodyType === 'undefined' || bodyType === 'null') {
    throw errors.unprocessableEntity('no JSON body provided', 422)
  }

  try {
    var content = JSON.parse(body)
  } catch (err) {
    throw errors.unprocessableEntity('could not parse request body as JSON', 422)
  }

  const parsedType = is(content)

  if (parsedType !== 'object') {
    throw errors.unprocessableEntity(`body parsed as ${parsedType} rather than object`, 422)
  }

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

validate.signinCredentials = async (req, res) => {
  try {
    var body = JSON.parse(req.body)
  } catch (err) {
    throw errors.badRequest('Invalid JSON login request body provided', 400)
  }

  if (!body.user) {
    throw errors.unprocessableEntity('Empty user value provided', 422)
  }
  if (!body.password) {
    throw errors.unprocessableEntity('Empty password value provided', 422)
  }
  if (body.password.length < 14) {
    throw errors.unprocessableEntity('Insuffienctly long password provided', 422)
  }

  return {
    userName: body.user,
    password: body.password
  }
}

validate.registerCredentials = async (req, res) => {
  try {
    var body = JSON.parse(req.body)
  } catch (err) {
    throw errors.badRequest('Invalid JSON login request body provided', 400)
  }

  if (!body.user) {
    throw errors.unprocessableEntity('Empty user value provided', 422)
  }
  if (!body.password) {
    throw errors.unprocessableEntity('Empty password value provided', 422)
  }
  if (body.password.length < 14) {
    throw errors.unprocessableEntity('Insuffienctly long password provided', 422)
  }

  return {
    userName: body.user,
    password: body.password
  }
}

module.exports = validate
