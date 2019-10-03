
import admin from 'firebase-admin'
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
 *
 * @returns {Promise<*>}
 */
firebase.createUser = async (userId, ctx) => {
  const ref = db.collection('users').doc(userId)
  const doc = await ref.get()

  if (!doc.exists) {
    log.debug(ctx, `storing information for new user ${userId}`)

    await ref.set({
      userId,
      ips: [
        ctx.ip || 'unknown'
      ],
      forwardedFor: [
        ctx.forwardedFor || 'unknown'
      ],
      trackingIdCount: 1
    })
  } else {
    log.debug(ctx, `user ${userId} already exists`)

    const existing = doc.data()

    let updatedTrackingIdCount = 1
    if (existing.trackingIdCount && !isNaN(existing.trackingIdCount)) {
      updatedTrackingIdCount = existing.trackingIdCount + 1
    }

    await ref.update({
      userId,
      ips: Array.from(new Set(existing.ips, ctx.ip || 'unknown')),
      forwardedFor: Array.from(new Set(existing.forwardedFor, ctx.forwardedFor || 'unknown')),
      trackingIdCount: updatedTrackingIdCount
    })
  }
}

firebase.saveMoods = async (userId, ctx, moods) => {
  const ref = db.collection('users').doc(userId)
  const doc = await ref.get()

  if (!doc.exists) {
    log.fatal(ctx, `profile missing for user ${userId}`)
    process.exit(1)
  }

  const existing = doc.data()
  const updated = { ...existing }

  updated.moods = updated.moods
    ? updated.moods.concat(moods)
    : moods

  log.debug(ctx, `adding moods for user ${userId}`)

  await db.collection('users').doc(userId).update(updated)

  log.success(ctx, `moods successfully added for user ${userId}`)
}

firebase.getMoods = async (userId, ctx, opts) => {
  const ref = db.collection('users').doc(userId)
  const doc = await ref.get()

  if (!doc.exists) {
    return []
  }

  const userData = doc.data()

  userData.moods.sort((datum0, datum1) => datum0.timestamp - datum1.timestamp)

  return {
    moods: userData.moods,
    stats: {
      to: userData.moods[userData.moods.length - 1].timestamp,
      from: userData.moods[0].timestamp
    }
  }
}

export default firebase
