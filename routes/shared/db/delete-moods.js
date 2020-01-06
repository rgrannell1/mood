
const log = require('../log')
const security = require('../security')
const validate = require('../validate')
const getDatabase = require('../database')
const {
  dataRoles,
  userId
} = require('../utils')

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
const deleteMoods = async (userId, ctx, opts) => {
  const db = getDatabase()
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
    roles: dataRoles.reader(userId)
  }

  log.debug(ctx, 'removing mood-data for user')
  const encrypted = security.user.encrypt(updated, opts.key)

  await db.collection('userdata').doc(userId).update(encrypted)

  log.success(ctx, 'moods successfully deleted for user')

  return {
    deleted: existingData.moods.length
  }
}

module.exports = deleteMoods
