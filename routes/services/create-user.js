
const bcrypt = require('bcrypt')
const errors = require('@rgrannell/errors')

const log = require('../shared/log')
const firebase = require('../shared/db')
const security = require('../shared/security')
const {
  userId
} = require('../shared/utils')

const saltRounds = 12

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

const checkPassword = async ({ hash, password, userId }, ctx) => {
  const isSame = await new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, result) => {
      err ? reject(err) : resolve(result)
    })
  })

  if (isSame) {
    ctx.userId = userId
  } else {
    throw errors.unauthorized('invalid password provided')
  }
}

const createUser = async ({ userName, password }, ctx, opts) => {
  try {
    var hash = await new Promise((resolve, reject) => {
      bcrypt.hash(password, saltRounds, (err, hash) => {
        err ? reject(err) : resolve(hash)
      })
    })
  } catch (err) {
    throw errors.internalServerError('failed to hash password', 500)
  }

  const db = firebase.database()

  const ref = db.collection('userdata').doc(userName)
  const doc = await ref.get()
  const data = doc.data()

  if (doc.exists) {
    await checkPassword({ password, hash: data.password, userId: data.userId }, ctx)
  } else {
    await createUserAccount({ userName, hash }, ref, ctx, opts)
  }

  return firebase.createSession(userName, ctx, {})
}

module.exports = createUser
