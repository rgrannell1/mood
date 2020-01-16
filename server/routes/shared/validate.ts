
import * as log from './log'
import errors from '@rgrannell/errors'
import constants from './constants'
import { validate as jsonSchema } from 'jsonschema'

const checkSchema = (object:any, schema:{[key:string]:any}) => {
  const report = jsonSchema(object, schema)

  const message = report.errors.map(error => {
    return ` - ${error.message} (${error.schema})`
  }).join('\n')

  if (message) {
    log.warn({}, `failed to validate schema:\n${message}`)
  }
}

const validate = {
  output: {
    get: {
      moods: {
        body: (body:any) => { }
      },
      metadata: {
        body: (body:any) => {
          if (!body.hasOwnProperty('version')) {
            log.warn({}, 'GET /api/metadata was missing property "version"')
          }
        }
      }
    },
    patch: {
      moods: {}
    },
    delete: {
      moods: {}
    }
  },
  input: {
    signinCredentials: async (req: any, res: any) => {
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
        username: body.user,
        password: body.password
      }
    },

    registerCredentials: async (req: any, res: any) => {
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
      if (body.user.length < 3) {
        throw errors.unprocessableEntity('Insuffienctly long username provided', 422)
      }
      if (body.password.length < 14) {
        throw errors.unprocessableEntity('Insuffienctly long password provided', 422)
      }

      return {
        username: body.user,
        password: body.password
      }
    },

    mood: (event: any, ith: number) => {
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
    },
    body: (body: any) => {
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

      content.events.forEach((event:any, ith:number) => {
        validate.input.mood(event, ith)
      })

      return content
    }
  },
  log,
  db: {
    session: (session: any): MoodSession => {
      checkSchema(session, schemas.session)

      return session
    },
    user: (user:any) => {
      checkSchema(user, schemas.user)

      return user
    }
  }
}

const schemas = {
  /**
   * Session database object
   */
  session: {
    id: '/session',
    type: 'object',
    required: ['username', 'sessionId'],
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
  },
  /**
   * Session user object
   */
  user: {
    id: '/user',
    type: 'object',
    required: ['forwardedFor', 'ips'],
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
      username: {
        type: 'string'
      }
    }
  }
}

const is = (val:any) => {
  return Object.prototype.toString.call(val).slice(8, -1).toLowerCase()
}

export default validate
