
import log from '../log'
import security from '../security'
import validate from '../validate'
import getDatabase from '../database'
const {
  dataRoles,
  userId
} = require('../utils')

/**
 * Update the user profile
 *
 * @param {FirebaseRef} ref a user reference
 * @param {string} username the username
 * @param {Object} ctx request context
 * @param {Object} opts firebase options
 *
 * @returns {Promise<>} a result promise
 */
const updateUser = async (ref, doc, ctx, opts) => {
  log.debug(ctx, 'user already exists; updating tracking information')

  const data = doc.data()
  const user = validate.db.user(data)

  let trackingIdCount = 1
  if (user.trackingIdCount && !isNaN(user.updatedTrackingIdCount)) {
    trackingIdCount = user.trackingIdCount + 1
  } else {
    log.warn(ctx, 'userId tracking count was non-existent or NaN')
  }

  const ips = [...data.ips]
  if (ctx.ip && !ips.includes(ctx.ip)) {
    ips.push(ctx.ip)
  }
  const forwardedFor = [...data.forwardedFor]
  if (ctx.forwardedFor && !forwardedFor.includes(ctx.forwardedFor)) {
    forwardedFor.push(ctx.forwardedFor)
  }

  const roles = dataRoles.reader(data.username)

  const updatedUserData = {
    username: data.username,
    password: data.password,
    userId: data.userId,
    registeredOn: data.registeredOn,
    ips,
    forwardedFor,
    trackingIdCount,
    roles
  }

  const encrypted = security.user.encrypt(updatedUserData, opts.key)

  return ref.update(encrypted)
}

/**
 * Create a new user
 *
 * @param {FirebaseRef} ref a user reference
 * @param {string} username the username
 * @param {Object} ctx request context
 * @param {Object} opts firebase options
 *
 * @returns {Promise<>} a result promise
 */
const createNewUser = async (ref, credentials, ctx, opts) => {
  const id = userId()
  log.debug(ctx, `storing information for new user ${id}`)

  ctx.userId = id

  const registeredOn = new Date()
  const ips = [ctx.ip || 'unknown']
  const forwardedFor = [ctx.forwardedFor || 'unknown']
  const trackingIdCount = 1
  const roles = dataRoles.reader(credentials.username)

  const newUserData = {
    username: credentials.username,
    password: credentials.hash,
    userId: id,
    registeredOn,
    ips,
    forwardedFor,
    trackingIdCount,
    roles
  }

  const encrypted = security.user.encrypt(newUserData, opts.key)

  return ref.set(encrypted)
}

/**
 * Save information about a user to the database, including
 * anonymised tracking information for security reasons.
 *
 * @param {string} userId the user-id
 * @param {object} ctx request metadata
 * @param {object} opts an object with a key
 *
 * @returns {Promise<*>}
 */
const createUser = async ({ username, password }, ctx, opts) => {
  const hash = await security.hashPassword(password)
  const db = getDatabase()

  const ref = db.collection('userdata').doc(username)
  const doc = await ref.get()

  const userExists = doc.exists

  const credentials = { username, hash }

  await userExists
    ? updateUser(ref, doc, ctx, opts)
    : createNewUser(ref, credentials, ctx, opts)
}

module.exports = createUser
