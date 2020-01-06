
const day = require('dayjs')

const errors = require('@rgrannell/errors')

const validate = require('./validate')
const security = require('./security')
const log = require('./log')

const { sessionId } = require('./utils')

const getDatabase = require('./database')
const db = getDatabase()

const firebase = {
  session: {},
  user: {},
  moods: {}
}

/**
 * Return a firebase data instance.
 *
 * @returns {Database}
 *
 */
firebase.database = () => {
  return db
}

firebase.user.create = require('./db/create-user')
firebase.session.create = require('./db/create-session')
firebase.moods.delete = require('./db/delete-moods')
firebase.getMoods = require('./db/get-moods')
firebase.saveMoods = require('./db/save-moods')

module.exports = firebase
