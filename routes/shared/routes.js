
const {
  trackingId,
  hash
} = require('./utils')
const signale = require('signale')
const errors = require('@rgrannell/errors')
const log = require('./log')

/**
 * What internal type is a value
 *
 * @param {any} val
 */
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

  log.error(ctx, `${err.name}: ${err.message}\n\n${err.stack}`)

  if (err.code && err.code !== 500) {
    res
      .status(err.code)
      .end(`${err.name}: ${err.message}`)
  } else {
    res
      .status(500)
      .end('error handling not implemented')
  }
}

/**
 * attach tracking information to the request object.
 *
 * @param {Request} req a request object
 */
const attachMetadata = (req, metadata) => {
  const state = {}

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
module.exports.routeMethod = (methods, metadata) => async (req, res) => {
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
