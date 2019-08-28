
import signale from 'signale'
import errors from '@rgrannell/errors'

const handleErrors = async (err, req, res) => {
  console.log(err)

  res
    .statusCode(500)
    .end('error handling not working ')

  // -- add custom errors for handling.
}

export const routeMethod = methods => async (req, res) => {
  signale.debug(`${req.method} ${req.path}`)

  try {
    if (!methods.has(req.method)) {
      const err = errors.METHOD_NOT_ALLOWED(`method ${req.method} not supported`, 'HTTP_405')
      throw err
    }
    console.log(methods)
    console.log(typeof methods)

    await methods.get(req.method)(req, res)

  } catch (err) {
    const isError = err instanceof Error
    const requestError = isError
      ? err
      : errors.INTERNAL_SERVER_ERROR('server failed to handle request', 'HTTP_500')

    await handleErrors(requestError, req, res)
  }
}
