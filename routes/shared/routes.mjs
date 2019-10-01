
import {
  trackingId,
  hash
} from './utils.mjs'
import signale from 'signale'
import * as errors from '@rgrannell/errors'
import { fdatasync } from 'fs'

const is = val => {
  return Object.prototype.toString.call(val).slice(8, -1).toLowerCase()
}

/**
 * Convert error conditions into HTTP responses
 *
 * @param {Error} err an error (usually a network-error) thrown in the request chain
 * @param {Request} req the request object
 * @param {Response} res the response error
 */
const handleErrors = async (err, req, res) => {
  const ctx = req.state

  res
    .status(500)
    .end('error handling not implemented')
}

/**
 * attach tracking information to the request object.
 *
 * @param {Request} req a request object
 */
const attachMetadata = req => {
  const state = {}

  state.trackingId = trackingId()
  state.ip = hash(req.headers['x-real-ip'] || '')
  state.forwardedFor = hash(req.headers['x-forwarded-for'] || '')
  state.userAgent = req.headers['user-agent'] || 'unknown'

  return state
}

/**
 * Route a path request to a specific method.
 *
 * @param {Map<string, function>} methods the available methods for this request.
 */
export const routeMethod = methods => async (req, res) => {
  req.state = attachMetadata(req)

  if (is(methods) !== 'map') {
    throw new TypeError(`methods supplied were invalid, as it had type ${is(methods)}`)
  }

  signale.debug(`received request ${req.method} ${req.url}`)

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
