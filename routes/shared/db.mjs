
import admin from 'firebase-admin'
import security from './security.mjs'
import log from './log.mjs'

import { sessionId } from './utils.mjs'

import config from './config.mjs'
const envConfig = config()

admin.initializeApp({
  credential: admin.credential.cert(envConfig.google.privateKey),
  databaseURL: envConfig.google.db
})

const db = admin.firestore()

const firebase = {}

firebase.database = () => db

firebase.createSession = async (username, ctx, opts) => {
  const ref = db.collection('sessions').doc(username)
  const doc = await ref.get()

  if (!doc.exists) {
    log.debug(ctx, `storing session information for ${ctx.userId}`)

    await ref.set({
      username,
      sessionId: sessionId()
    })

    return (await ref.get()).data()
  } else {
    log.debug(ctx, `session already exists for ${ctx.userId}`)
  }

  return doc.data()
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
  const ref = db.collection('users').doc(username)
  const doc = await ref.get()

  const roles = {
    [username]: 'reader'
  }

  if (!doc.exists) {
    log.debug(ctx, `storing information for new user ${ctx.userNickname}`)

    const saved = {
      username,
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
    log.debug(ctx, `user ${ctx.userNickname} already exists`)

    const existing = doc.data()

    let updatedTrackingIdCount = 1
    if (existing.trackingIdCount && !isNaN(existing.trackingIdCount)) {
      updatedTrackingIdCount = existing.trackingIdCount + 1
    }

    const saved = {
      username,
      ips: Array.from(new Set(existing.ips, ctx.ip || 'unknown')),
      forwardedFor: Array.from(new Set(existing.forwardedFor, ctx.forwardedFor || 'unknown')),
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
  const ref = db.collection('users').doc(userId)
  const doc = await ref.get()

  if (!doc.exists) {
    log.fatal(ctx, `profile missing for user ${ctx.userNickname}`)
    process.exit(1)
  }

  const existing = security.user.decrypt(doc.data(), opts.key)
  const updated = {
    ...existing,
    roles: {
      [userId]: 'reader'
    }
  }

  updated.moods = updated.moods
    ? updated.moods.concat(moods)
    : moods

  log.debug(ctx, `adding moods for user ${ctx.userNickname}`)

  const encrypted = security.user.encrypt(updated, opts.key)

  await db.collection('users').doc(userId).update(encrypted)

  log.success(ctx, `moods successfully added for user ${ctx.userNickname}`)

  return {
    moodsSaved: updated.moods.length
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
