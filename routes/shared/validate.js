
const log = require('./log')
const signale = require('signale')
const errors = require('@rgrannell/errors')
const constants = require('./constants')
const jsonSchema = require('jsonschema').validate

const checkSchema = (object, schema) => {
  const report = jsonSchema(object, schema)

  const message = report.errors.map(error => {
    return `${error.message} (${error.schema})`
  }).join('\n')

  if (message) {
    log.warn(message)
  }
}

const validate = {
  input: {}
}

const schemas = {}

/**
 * Session database object
 */
schemas.session = {
  id: '/session',
  type: 'object',
  properties: {
    username: {
      type: 'string',
      minLength: 3,
      maxLength: 64
    },
    sessionId: {
      type: 'string',
      minLength: 16,
      maxLength: 16
    }
  }
}

/**
 * Session user object
 */
schemas.user = {
  id: '/user',
  type: 'object',
  properties: {
    forwardedFor: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    ips: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    moods: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          mood: {
            type: 'string',
            enum: constants.moods
          },
          timestamp: {
            type: 'number'
          },
          id: {
            type: 'string'
          }
        }
      }
    },
    trackingIdCount: {
      type: 'number'
    },
    userId: {
      type: 'string'
    },
    userName: {
      type: 'string'
    }
  }
}

validate.input.mood = (event, ith) => {
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

validate.input.body = body => {
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
    validate.input.mood(event, ith)
  })

  return content
}

validate.input.signinCredentials = async (req, res) => {
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

validate.input.registerCredentials = async (req, res) => {
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

validate.output = {
  get: {
    moods: {},
    metadata: {}
  },
  patch: {
    moods: {}
  },
  delete: {
    moods: {}
  }
}

validate.output.get.moods.body = body => {

}

validate.output.get.metadata.body = body => {
  if (!body.hasOwnProperty('version')) {
    signale.warn('GET /api/metadata was missing property "version"')
  }
}

validate.db = {}

validate.db.session = session => {
  checkSchema(session, schemas.session)

  return session
}

validate.db.user = user => {
  checkSchema(user, schemas.user)

  return user
}

module.exports = validate