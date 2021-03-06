
import * as log from '../log'
import * as security from '../security'
import validate from '../validate'
import getDatabase from '../database'
import updateUserProfile from '../../services/update-user-profile'
import {
  dataRoles,
  userId
} from '../utils'

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
const updateUser = async (ref:any, doc:any, ctx: RequestState, opts: {key: string}) => {
  log.debug(ctx, 'user already exists; updating tracking information')

  const data = doc.data()
  const user = validate.db.user(data)

  const updated = updateUserProfile(data, ctx)
  const encrypted = security.user.encrypt(updated, opts.key)

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
const createNewUser = async (ref: any, credentials: { username: string, hash: string }, ctx: RequestState, opts: FirebaseOpts) => {
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
    roles,
    moods: []
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
const createUser = async ({ username, password }: UserCredentials, ctx: RequestState, opts: {key: string}) => {
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

export default createUser
