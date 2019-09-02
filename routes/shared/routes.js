
import signale from 'signale'
import * as errors from '@rgrannell/errors'

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
  res
    .status(500)
    .end('error handling not working ')
}

/**
 * Route a path request to a specific method.
 *
 * @param {Map<string, function>} methods the available methods for this request.
 */
export const routeMethod = methods => async (req, res) => {
  if (is(methods) !== 'map') {
    throw new TypeError(`methods supplied were invalid, as it had type ${is(methods)}`)
  }

  signale.debug(`received request ${req.method} ${req.originalUrl}`)

  try {
    if (!methods.has(req.method)) {
      throw errors.methodNotAllowed(`method ${req.method} not supported`, 405)
    }

    const route = methods.get(req.method)
    await route(req, res)
  } catch (err) {
    signale.warn(`error-response received: ${err.message ? err.message : err}`)

    const requestError = err.message
      ? err
      : errors.internalServerError('server failed to handle request', 500)

    await handleErrors(requestError, req, res)
  }
}
