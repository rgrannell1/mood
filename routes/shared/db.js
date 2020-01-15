
const day = require('dayjs')

const errors = require('@rgrannell/errors')

const validate = require('./validate')
const security = require('./security')
const log = require('./log')

const { sessionId } = require('./utils')

const getDatabase = require('./database')
const db = getDatabase()

const firebase = {
  session: {
    create: require('./db/create-session'),
    get: require('./db/get-session')

  },
  user: {
    create: require('./db/create-user')
  },
  moods: {
    delete: require('./db/delete-moods'),
    get: require('./db/get-moods'),
    save: require('./db/save-moods')
  }
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

module.exports = firebase
