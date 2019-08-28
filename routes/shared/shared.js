
import signale from 'signale'
//const errors = require('@rgrannell/errors')
import * as errors from '@rgrannell/errors'
//import * as createError from 'http-errors'

const handleErrors = async (err, req, res) => {
  res
    .status(500)
    .end('error handling not working ')
}

export const routeMethod = methods => async (req, res) => {
  signale.debug(`${req.method} ${req.originalUrl}`)

  try {
    if (!methods.has(req.method)) {
      const err = errors.methodNotAllowed(`method ${req.method} not supported`, 405)
      throw err
    }

    const route = methods.get(req.method)

    if (typeof route !== 'function') {
      signale.error(`unsupported method ${req.method}`)
      throw errors.internalServerError('server failed to handle request', 500)
    }

    await route(req, res)

  } catch (err) {
    signale.warn(`error-response received: ${err.message ? err.message : err}`)

    const requestError = err.message
      ? err
      : errors.internalServerError('server failed to handle request', 500)

    await handleErrors(requestError, req, res)
  }
}
