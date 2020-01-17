
import updateUserProfile from '../../services/update-user-profile'
import * as errors from '@rgrannell/errors'

import * as log from '../log'
import * as security from '../security'
import validate from '../validate'
import getDatabase from '../database'
import {
  dataRoles,
  userId
} from '../utils'

/**
 * Delete mood-data
 *
 * @param {string} userId the user-id
 * @param {object} ctx request metadata
 * @param {object} opts an object with a key
 *
 * @returns {Promise<*>}
 */
const deleteMoods = async (username: string, ctx: RequestState, opts: FirebaseOpts) => {
  if (!username) {
    throw errors.unauthorized('username not present.', 401)
  }

  const db = getDatabase()
  const ref = db.collection('userdata').doc(username)
  const doc = await ref.get()

  const profileExists = doc.exists
  if (!profileExists) {
    throw errors.notFound('cannot authorize deletion; user profile not found', 404)
  }

  // -- create an empty user-profile.
  const encryptedData = validate.db.user(doc.data())
  const existingData = security.user.decrypt(encryptedData, opts.key)
  const updated = updateUserProfile(existingData, ctx)

  updated.moods = []


  log.debug(ctx, 'removing mood-data for user')
  const encrypted = security.user.encrypt(updated, opts.key)

  await db.collection('userdata').doc(username).update(encrypted)

  log.success(ctx, 'moods successfully deleted for user')

  return {
    deleted: existingData.moods.length
  }
}

export default deleteMoods
