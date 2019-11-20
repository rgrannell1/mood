
const db = require('./db')
const errors = require('@rgrannell/errors')

module.exports = (req, res) => {
  if (!req.headers.Authorization) {
    throw errors.unauthorized('Authorization header missing', 401)
  }

  const [type, credentials, ...rest] = req.headers.Authorization.split(' ')

  if (rest.length > 0) {
    throw errors.unauthorized('Invalid authorization header provided, too many spaces present', 401)
  }

  if (type !== 'Basic') {
    throw errors.unauthorized('Invalid authorization scheme used', 401)
  }

  if (!credentials) {
    throw errors.unauthorized('Basic auth credential provided', 401)
  }
}
