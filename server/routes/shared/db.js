
import day from 'dayjs'

const errors = require('@rgrannell/errors')

import validate from './validate'
import security from './security'
import log from './log'

import { sessionId } from './utils'

import getDatabase from './database'
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
