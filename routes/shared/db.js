
const day = require('dayjs')

const errors = require('@rgrannell/errors')

const validate = require('./validate')
const security = require('./security')
const log = require('./log')

const { sessionId } = require('./utils')

const getDatabase = require('./database')
const db = getDatabase()

const firebase = {
  session: {},
  user: {}
}

const roles = {
  reader (userId) {
    return {
      [userId]: 'reader'
    }
  }
}

const unknown = val => {
  return val || 'unknown'
}

/**
 * Return a firebase data instance.
 *
 * @returns {Database}
 *
 */
firebase.database = () => {
  return db
}

/**
 * Get session information for a user, given a sessionId
 *
 * @param {string} sessionId
 * @param {Object} ctx
 * @param {Object} opts
 *
 * @returns {Object} session information
 */
firebase.getSession = async (sessionId, ctx, opts) => {
  const ref = db.collection('sessions').where('sessionId', '==', sessionId)
  const doc = await ref.get()

  if (!doc.docs) {
    throw errors.unauthorized('no sessions found for sessionId', 401)
  }

  if (doc.docs.length > 1) {
    log.warn(`expected single session for user but found ${doc.docs.length} sessions.`)
  }

  const [session] = doc.docs

  return validate.db.session(session.data())
}

firebase.user.create = require('./db/create-user')
firebase.session.create = require('./db/create-session')

/**
 * Add mood data to the database
 *
 * @param {string} userId the user-id
 * @param {object} ctx request metadata
 * @param {array} moods a list of mood objects
 * @param {object} opts an object with a key
 *
 * @returns {Promise<*>}
 */
firebase.saveMoods = async (userId, ctx, moods, opts) => {
  const ref = db.collection('userdata').doc(userId)
  const doc = await ref.get()

  if (!doc.exists) {
    log.error(ctx, 'profile missing for user')
    process.exit(1)
  }

  const data = validate.db.user(doc.data())
  const currentUser = security.user.decrypt(data, opts.key)
  const user = {
    ...currentUser,
    roles: roles.reader(userId)
  }

  user.moods = user.moods
    ? user.moods.concat(moods)
    : moods

  log.debug(ctx, 'adding moods for user')

  const encrypted = security.user.encrypt(user, opts.key)

  await db.collection('userdata').doc(userId).update(encrypted)

  log.success(ctx, 'moods successfully added for user')

  return {
    saved: user.moods.length
  }
}

/**
 * Retrieve mood data from the database
 *
 * @param {string} userId the user-id
 * @param {object} ctx request metadata
 * @param {array} moods a list of mood objects
 * @param {object} opts an object with a key
 *
 * @returns {Promise<*>}
 */
firebase.getMoods = async (userId, ctx, opts) => {
  const ref = db.collection('userdata').doc(userId)
  const doc = await ref.get()

  if (!doc.exists) {
    return {
      moods: [],
      stats: {
        count: 0
      }
    }
  }

  const data = validate.db.user(doc.data())
  const userData = security.user.decrypt(data, opts.key)

  if (!userData.moods) {
    userData.moods = []
  }

  userData.moods.sort((datum0, datum1) => datum0.timestamp - datum1.timestamp)

  let stats

  if (userData.moods.length === 0) {
    stats = {
      count: 0
    }
  } else {
    const to = userData.moods[userData.moods.length - 1].timestamp
    const from = userData.moods[0].timestamp

    stats = {
      count: userData.moods.length,
      to,
      from,
      timeInterval: {
        days: day(to).diff(day(from), 'days')
      }
    }
  }

  return {
    moods: userData.moods,
    stats
  }
}

/**
 * Delete mood-data
 *
 * @param {string} userId the user-id
 * @param {object} ctx request metadata
 * @param {object} opts an object with a key
 *
 * @returns {Promise<*>}
 *
 */
firebase.deleteMoods = async (userId, ctx, opts) => {
  const ref = db.collection('userdata').doc(userId)
  const doc = await ref.get()

  const profileExists = doc.exists
  if (!profileExists) {
    log.error(ctx, 'profile unexpectedly missing for user; exiting')
    process.exit(1)
  }

  // -- create an empty user-profile.
  const encryptedData = validate.db.user(doc.data())
  const existingData = security.user.decrypt(encryptedData, opts.key)
  const updated = {
    ...existingData,
    moods: [],
    roles: roles.reader(userId)
  }

  log.debug(ctx, 'removing mood-data for user')
  const encrypted = security.user.encrypt(updated, opts.key)

  await db.collection('userdata').doc(userId).update(encrypted)

  log.success(ctx, 'moods successfully deleted for user')

  return {
    deleted: existingData.moods.length
  }
}

module.exports = firebase
