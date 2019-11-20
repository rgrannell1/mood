
const errors = require('@rgrannell/errors')

const log = require('../shared/log')
const firebase = require('../shared/db')
const security = require('../shared/security')
const {
  userId
} = require('../shared/utils')

const createUserAccount = async ({ userName, hash }, ref, ctx, opts) => {
  const id = userId()
  log.debug(ctx, `storing information for new user ${id}`)

  ctx.userId = id

  const saved = {
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

  await ref.set(security.user.encrypt(saved, opts.key))
}

const createUser = async ({ userName, password }, ctx, opts) => {
  const hash = security.hashPassword(password)

  const db = firebase.database()

  const ref = db.collection('userdata').doc(userName)
  const doc = await ref.get()

  const userExists = doc.exists

  if (userExists) {
    throw errors.unauthorized('user already exists', 401)
  }

  await createUserAccount({ userName, hash }, ref, ctx, opts)

  return firebase.createSession(userName, ctx, {})
}

module.exports = createUser
