
import admin from 'firebase-admin'
import security from './security.mjs'
import log from './log.mjs'

import config from './config.mjs'
const envConfig = config()

admin.initializeApp({
  credential: admin.credential.cert(envConfig.google.privateKey),
  databaseURL: envConfig.google.db
})

const db = admin.firestore()

const firebase = {}

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
firebase.createUser = async (userId, ctx, opts) => {
  const ref = db.collection('users').doc(userId)
  const doc = await ref.get()

  if (!doc.exists) {
    log.debug(ctx, `storing information for new user ${userId}`)

    const saved = {
      userId,
      ips: [
        ctx.ip || 'unknown'
      ],
      forwardedFor: [
        ctx.forwardedFor || 'unknown'
      ],
      trackingIdCount: 1
    }

    await ref.set(security.user.encrypt(saved, opts.key))
  } else {
    log.debug(ctx, `user ${userId} already exists`)

    const existing = doc.data()

    let updatedTrackingIdCount = 1
    if (existing.trackingIdCount && !isNaN(existing.trackingIdCount)) {
      updatedTrackingIdCount = existing.trackingIdCount + 1
    }

    const saved = {
      userId,
      ips: Array.from(new Set(existing.ips, ctx.ip || 'unknown')),
      forwardedFor: Array.from(new Set(existing.forwardedFor, ctx.forwardedFor || 'unknown')),
      trackingIdCount: updatedTrackingIdCount
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
  const ref = db.collection('users').doc(userId)
  const doc = await ref.get()

  if (!doc.exists) {
    log.fatal(ctx, `profile missing for user ${userId}`)
    process.exit(1)
  }

  const existing = security.user.decrypt(doc.data(), opts.key)
  const updated = { ...existing }

  updated.moods = updated.moods
    ? updated.moods.concat(moods)
    : moods

  log.debug(ctx, `adding moods for user ${userId}`)

  const encrypted = security.user.encrypt(updated, opts.key)

  await db.collection('users').doc(userId).update(encrypted)

  log.success(ctx, `moods successfully added for user ${userId}`)
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
  const ref = db.collection('users').doc(userId)
  const doc = await ref.get()

  if (!doc.exists) {
    return []
  }

  // -- sort moods by date
  const userData = security.user.decrypt(doc.data(), opts.key)

  userData.moods.sort((datum0, datum1) => datum0.timestamp - datum1.timestamp)

  const retrieved = {
    moods: userData.moods,
    stats: {
      to: userData.moods[userData.moods.length - 1].timestamp,
      from: userData.moods[0].timestamp
    }
  }

  return retrieved
}

export default firebase
