
import {
  trackingId,
  hash
} from './utils.js'
import log from './log'
import * as errors from '@rgrannell/errors'
import { route } from './types.js'

/**
 * Convert error conditions into HTTP responses
 *
 * @param {Error} err an error (usually a network-error) thrown in the request chain
 * @param {Request} req the request object
 * @param {Response} res the response error
 */
const handleErrors = (_: Error, req, res): any => {
  // const ctx = req.state

  res
    .status(500)
    .end('error handling not implemented')
}

interface Context {
  trackingId: string
  ip: string
  forwardedFor: string
  userAgent: string
}

/**
 * attach tracking information to the request object.
 *
 * @param {Request} req a request object
 */
const attachMetadata = (req: Request): Context => {
  const state: Context = {
    trackingId: trackingId(),
    ip: hash(req.headers['x-real-ip']),
    forwardedFor: hash(req.headers['x-forwarded-for']),
    userAgent: req.headers['user-agent']
  }

  return state
}

/**
 * Route a path request to a specific method.
 *
 * @param {Map<string, function>} methods the available methods for this request.
 */
export const routeMethod = (methods: Map<string, route>) => async (req, res) => {
  req.state = attachMetadata(req)

//  log.debug(req.state, `received request ${req.method} ${req.url}`)

  try {
    if (!methods.has(req.method)) {
      throw errors.methodNotAllowed(`method ${req.method} not supported`, 405)
    }

    const route = methods.get(req.method)
    await route(req, res)
  } catch (err) {
 //   log.warn(req.state, `error-response received: ${err.message ? err.message : err} \n${err.stack}`)

    const requestError = err.message
      ? err
      : errors.internalServerError('server failed to handle request', 500)

    await handleErrors(requestError, req, res)
  }
}
