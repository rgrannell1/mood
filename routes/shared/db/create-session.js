
const log = require('../log')
const validate = require('../validate')
const getDatabase = require('../database')
const {
  dataRoles,
  sessionId
} = require('../utils')

/**
 * Create a session for a user
 *
 * @param {string} username
 * @param {Object} ctx
 * @param {Object} opts
 *
 * @returns {Promise<Object>} session information
 */
const createSession = async (username, ctx, opts) => {
  const db = getDatabase()
  const ref = db.collection('sessions').doc(username)
  const doc = await ref.get()

  const sessionExists = doc.exists

  if (sessionExists) {
    log.debug(ctx, `session already exists for ${ctx.userId}`)
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

  return validate.db.session(doc.data())
}

module.exports = createSession
