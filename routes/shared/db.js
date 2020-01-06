
const day = require('dayjs')

const admin = require('firebase-admin')
const errors = require('@rgrannell/errors')

const validate = require('./validate')
const security = require('./security')
const log = require('./log')

const { sessionId } = require('./utils')

const config = require('./config')
const envConfig = config()

admin.initializeApp({
  credential: admin.credential.cert(envConfig.google.privateKey),
  databaseURL: envConfig.google.db
})

const db = admin.firestore()

const firebase = {
  session: {}
}

firebase.database = () => db

/**
 * Create a session for a user
 *
 * @param {string} username
 * @param {Object} ctx
 * @param {Object} opts
 *
 * @returns {Promise<Object>} session information
 */
firebase.session.create = async (username, ctx, opts) => {
  const ref = db.collection('sessions').doc(username)
  const doc = await ref.get()

  const sessionExists = doc.exists

  if (sessionExists) {
    log.debug(ctx, `session already exists for ${ctx.userId}`)
  } else {
    log.debug(ctx, `storing session information for ${ctx.userId}`)

    const session = validate.db.session({
      username,
      sessionId: sessionId()
    })

    await ref.set(session)

    return validate.db.session((await ref.get()).data())
  }

  return validate.db.session(doc.data())
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
firebase.createUser = async (username, ctx, opts) => {
  const ref = db.collection('userdata').doc(username)
  const doc = await ref.get()

  const roles = {
    [username]: 'reader'
  }

  if (!doc.exists) {
    log.debug(ctx, 'storing information for new user')

    const saved = {
      username,
      registeredOn: new Date(),
      ips: [
        ctx.ip || 'unknown'
      ],
      forwardedFor: [
        ctx.forwardedFor || 'unknown'
      ],
      trackingIdCount: 1,
      ...roles
    }

    await ref.set(security.user.encrypt(saved, opts.key))
  } else {
    log.debug(ctx, 'user already exists')

    const existingUser = validate.db.user(doc.data())

    let updatedTrackingIdCount = 1
    if (existingUser.trackingIdCount && !isNaN(existingUser.trackingIdCount)) {
      updatedTrackingIdCount = existingUser.trackingIdCount + 1
    }

    const saved = {
      username,
      ips: Array.from(new Set(existingUser.ips, ctx.ip || 'unknown')),
      forwardedFor: Array.from(new Set(existingUser.forwardedFor, ctx.forwardedFor || 'unknown')),
      trackingIdCount: updatedTrackingIdCount,
      ...roles
    }

    await ref.update(security.user.encrypt(saved, opts.key))
  }
}

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
    roles: {
      [userId]: 'reader'
    }
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

  if (!doc.exists) {
    log.error(ctx, 'profile missing for user')
    process.exit(1)
  }

  const data = validate.db.user(doc.data())
  const existing = security.user.decrypt(data, opts.key)
  const updated = {
    ...existing,
    moods: [],
    roles: {
      [userId]: 'reader'
    }
  }

  log.debug(ctx, 'removing moods for user')

  const encrypted = security.user.encrypt(updated, opts.key)

  await db.collection('userdata').doc(userId).update(encrypted)

  log.success(ctx, 'moods successfully added for user')

  return {
    deleted: existing.moods.length
  }
}

module.exports = firebase
