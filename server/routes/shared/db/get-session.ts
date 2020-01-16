
import * as log from '../log'
import validate from '../validate'
import getDatabase from '../database'
import errors from '@rgrannell/errors'

/**
 * Get session information for a user, given a sessionId
 *
 * @param {string} sessionId
 * @param {Object} ctx
 * @param {Object} opts
 *
 * @returns {Object} session information
 */
const getSession = async (sessionId: string, ctx: RequestState, opts: FirebaseOpts) => {
  const db = getDatabase()
  const ref = db.collection('sessions').where('sessionId', '==', sessionId)
  const doc = await ref.get()

  if (!doc.docs) {
    throw errors.unauthorized('no sessions found for sessionId', 401)
  }

  if (doc.docs.length > 1) {
    log.warn({}, `expected single session for user but found ${doc.docs.length} sessions.`)
  }

  const [session] = doc.docs

  return validate.db.session(session.data())
}

export default getSession
