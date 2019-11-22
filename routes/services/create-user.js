
const errors = require('@rgrannell/errors')

const log = require('../shared/log')
const firebase = require('../shared/db')
const security = require('../shared/security')
const {
  userId
} = require('../shared/utils')

/**
 * Create a user-object in the database
 *
 * @param {Object} credentials user-credentials
 * @param {Object} ctx request context
 * @param {Object} opts firebase options
 *
 * @returns {Object} a firebase session
 */
const createUser = async ({ userName, password }, ctx, opts) => {
  const hash = await security.hashPassword(password)

  const db = firebase.database()

  const ref = db.collection('userdata').doc(userName)
  const doc = await ref.get()

  const userExists = doc.exists

  if (userExists) {
    throw errors.unauthorized('user already exists', 401)
  }

  const id = userId()
  log.debug(ctx, `storing information for new user ${id}`)

  ctx.userId = id

  const userFields = {
    userName,
    password: hash,
    userId: id,
    ips: [
      ctx.ip || 'unknown'
    ],
    forwardedFor: [
      ctx.forwardedFor || 'unknown'
    ],
    trackingIdCount: 1
  }

  await ref.set(security.user.encrypt(userFields, opts.key))

  return firebase.createSession(userName, ctx, {})
}

module.exports = createUser
