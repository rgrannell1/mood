
const day = require('dayjs')

const log = require('../log')
const validate = require('../validate')
const security = require('../security')
const getDatabase = require('../database')
const {
  dataRoles,
  sessionId
} = require('../utils')

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
const saveMoods = async (userId, ctx, moods, opts) => {
  const db = getDatabase()
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
    roles: dataRoles.reader(userId)
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

module.exports = saveMoods
