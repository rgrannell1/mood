
import * as admin from 'firebase-admin'
import config from './config'
import log from './log'

admin.initializeApp({
  credential: admin.credential.cert(config.google.privateKey),
  databaseURL: config.google.db
})

const db = admin.firestore()

const getEmptyProfile = (userId, ctx) => {
  return {
    userId,
    ips: [
      ctx.ip || 'unknown'
    ],
    forwardedFor: [
      ctx.forwardedFor || 'unknown'
    ],
    trackingId: [
      ctx.trackingId
    ]
  }
}

const unique = (arr0, arr1) => {
  return Array.from(new Set([...arr0, ...arr1]))
}

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
export const createUser = async (userId: string, ctx: any) => {
  const ref = db.collection('users').doc(userId)
  const doc = await ref.get()

  if (!doc.exists) {
    log.debug(ctx, `storing information for new user ${userId}`)

    await ref.set(getEmptyProfile(userId, ctx))
  } else {
    log.debug(ctx, `user ${userId} already exists`)

    const existing = doc.data()

    await ref.update({
      userId,
      ips: unique(existing.ips, [ctx.ip || 'unknown']),
      forwardedFor: unique(existing.forwardedFor, [ctx.forwardedFor || 'unknown']),
      trackingId: unique(existing.trackingId, [ctx.trackingId])
    })
  }
}

export const saveMoods = async (userId: string, ctx: object, moods: object[]) => {
  const ref = db.collection('users').doc(userId)
  const doc = await ref.get()

  if (!doc.exists) {
    log.error(ctx, `profile missing for user ${userId}`)
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

export const getMoods = async (userId: string) => {
  const ref = db.collection('users').doc(userId)
  const doc = await ref.get()

  if (!doc.exists) {
    return []
  }

  const userData = doc.data()

  return userData.moods
}
