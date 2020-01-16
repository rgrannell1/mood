
import {
  trackingId,
  hash
} from './utils'
import signale from 'signale'
import errors from '@rgrannell/errors'
import * as log from './log'

/**
 * What internal type is a value
 *
 * @param {any} val
 */
const is = (val:any) => {
  return Object.prototype.toString.call(val).slice(8, -1).toLowerCase()
}

/**
 * Convert error conditions into HTTP responses
 *
 * @param {Error} err an error (usually a network-error) thrown in the request chain
 * @param {Request} req the request object
 * @param {Response} res the response error
 */
const handleErrors = async (err: MoodError, req: MoodRequest, res: MoodResponse) => {
  const ctx = req.state

  log.error(ctx, `${err.name}: ${err.message}\n\n${err.stack}`)

  if (err.code && err.code !== 500) {
    res
      .status(err.code)
      .end(`${err.name}: ${err.message}`)
  } else if (err.code && err.code === 500) {
    res
      .status(err.code)
      .end(`${err.name}: internal service error.`)
  } else {
    res
      .status(500)
      .end('internal service error')
  }
}

/**
 * attach tracking information to the request object.
 *
 * @param {Request} req a request object
 */
const attachMetadata = (req: MoodRequest, metadata) => {
  const state:RequestState = {}

  state.trackingId = trackingId()
  state.ip = hash(req.headers['x-real-ip'] || '')
  state.forwardedFor = hash(req.headers['x-forwarded-for'] || '')
  state.userAgent = req.headers['user-agent'] || 'unknown'
  state.url = metadata.url

  return state
}

/**
 * Route a path request to a specific method.
 *
 * @param {Map<string, function>} methods the available methods for this request.
 */
export const routeMethod = (methods: Map<string, Function>, metadata: { [key: string]: any }) => async (req: MoodRequest, res: MoodResponse) => {
  req.state = attachMetadata(req, metadata)

  if (is(methods) !== 'map') {
    throw new TypeError(`methods supplied were invalid, as it had type ${is(methods)}`)
  }

  signale.debug(`received request ${req.method} ${req.state.url}`)

  try {
    if (!methods.has(req.method)) {
      throw errors.methodNotAllowed(`method ${req.method} not supported`, 405)
    }

    const route = methods.get(req.method)
    await route(req, res)
  } catch (err) {
    signale.warn(`error-response received: ${err.message ? err.message : err} \n${err.stack}`)

    const requestError = err.message
      ? err
      : errors.internalServerError('server failed to handle request', 500)

    await handleErrors(requestError, req, res)
  }
}
