
import updateUserProfile from '../../services/update-user-profile'
import day from 'dayjs'
import errors from '@rgrannell/errors'

import validate from '../validate'
import * as security from '../security'
import getDatabase from '../database'

/**
 * Retrieve mood data from the database
 *
 * @param {string} username the user-id
 * @param {object} ctx request metadata
 * @param {array} moods a list of mood objects
 * @param {object} opts an object with a key
 *
 * @returns {Promise<*>}
 */
const getProfile = async (username: string, ctx: RequestState, opts: FirebaseOpts) => {
  const db = getDatabase()

  const ref = db.collection('userdata').doc(username)
  const doc = await ref.get()

  if (!doc.exists) {
    throw errors.authorization('no user-profile found', 401)
  }

  const data = validate.db.user(doc.data())
  const userData = security.user.decrypt(data, opts.key)

  return {
    userId: userData.userId,
    username: userData.username,
    registeredOn: userData.registeredOn
  }
}

export default getProfile
