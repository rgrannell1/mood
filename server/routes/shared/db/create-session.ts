
import * as log from '../log'
import validate from '../validate'
import getDatabase from '../database'
import { dataRoles, sessionId } from '../utils'

/**
 * Create a session for a user
 *
 * @param {string} username
 * @param {Object} ctx
 * @param {Object} opts
 *
 * @returns {Promise<Object>} session information
 */
const createSession = async (username:string, ctx:RequestState, opts:{key: string}) => {
  const db = getDatabase()
  const ref = db.collection('sessions').doc(username)
  const doc = await ref.get()

  const sessionExists = doc.exists

  if (!ctx.userId) {
    log.error(ctx, 'userid not present for request.')
  }

  if (sessionExists) {
    log.debug(ctx, `session already exists for ${ctx.userId}`)

    return validate.db.session(doc.data())
  } else {
    log.debug(ctx, `storing session information for ${ctx.userId}`)

    const session = validate.db.session({
      username,
      sessionId: sessionId(),
      roles: dataRoles.reader(username)
    })

    await ref.set(session)

    return validate.db.session((await ref.get()).data())
  }
}

export default createSession
