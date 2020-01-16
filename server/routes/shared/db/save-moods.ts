
import * as log from '../log'
import validate from '../validate'
import * as security from '../security'
import getDatabase from '../database'
import {
  dataRoles
} from '../utils'

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
const saveMoods = async (userId:string, ctx:RequestState, moods:any, opts:{key:string}) => {
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

export default saveMoods
