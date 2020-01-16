
import day from 'dayjs'

import validate from '../validate'
import * as security from '../security'
import getDatabase from '../database'

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
const getMoods = async (userId:string, ctx, opts: FirebaseOpts) => {
  const db = getDatabase()

  const ref = db.collection('userdata').doc(userId)
  const doc = await ref.get()

  if (!doc.exists) {
    return {
      moods: [],
      stats: {
        count: 0
      }
    }
  }

  const data = validate.db.user(doc.data())
  const userData = security.user.decrypt(data, opts.key)

  if (!userData.moods) {
    userData.moods = []
  }

  userData.moods.sort((datum0, datum1) => datum0.timestamp - datum1.timestamp)

  let stats

  if (userData.moods.length === 0) {
    stats = {
      count: 0
    }
  } else {
    const to = userData.moods[userData.moods.length - 1].timestamp
    const from = userData.moods[0].timestamp

    stats = {
      count: userData.moods.length,
      to,
      from,
      timeInterval: {
        days: day(to).diff(day(from), 'day')
      }
    }
  }

  return {
    moods: userData.moods,
    stats
  }
}

export default getMoods
