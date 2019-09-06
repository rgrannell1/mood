
const admin = require('firebase-admin')
const config = require('./config')
const log = require('./log')

admin.initializeApp({
  credential: admin.credential.cert(config.google.privateKey),
  databaseURL: config.google.db
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
        ctx.ip || 'unknown',
      ],
      forwardedFor: [
        ctx.forwardedFor || 'unknown',
      ],
      trackingId: [
        ctx.trackingId
      ]
    })
  } else {
    log.debug(ctx, `user ${userId} already exists`)

    const existing = doc.data()

    await ref.update({
      userId,
      ips: Array.from(new Set(existing.ips, ctx.ip || 'unknown')),
      forwardedFor: Array.from(new Set(existing.forwardedFor, ctx.forwardedFor || 'unknown')),
      trackingId: [
        ...existing.trackingId,
        ctx.trackingId
      ]
    })
  }

  console.log(doc.data())
}

firebase.saveMoods = async (userId, moods) => {
  await db.collection('users').doc(userId).update({
    userId
  })
}

module.exports = firebase
